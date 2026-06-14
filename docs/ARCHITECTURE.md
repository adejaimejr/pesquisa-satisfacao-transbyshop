# ARCHITECTURE

## Visao Geral

Single engine, multi-tenant por `$host`. Um container nginx serve N clientes; cada domínio cai na pasta do seu cliente. Sem build e sem backend próprio — tudo é renderizado no boot por shell + `envsubst`.

```
request (Host: cliente.com)
   │
   ▼
nginx ──(map $host → $tenant_root)──► /usr/share/nginx/html/<slug>/index.html  (+ logo, + relatorios)
```

## Componentes

| Caminho | Papel |
|---|---|
| `engine/pesquisa.template.html` | Template do formulário CSAT. Marca via tokens `${...}`. Perguntas inline (compartilhadas). |
| `engine/nginx.conf.template` | `server` com `root $tenant_root;` → vira `/etc/nginx/conf.d/default.conf`. |
| `clientes/<slug>/config.env` | Valores dos tokens (cores, logo, título, domínio). |
| `clientes/<slug>/logo.*` | Logo do cliente. |
| `clientes/<slug>/relatorios/*.html` | Relatórios executivos autocontidos. |
| `clientes/<slug>/index.html` | *(opcional)* design 100% próprio — ignora o template. |
| `docker-entrypoint.sh` | Renderiza por cliente, injeta URL, copia assets, gera o `map`, sobe o nginx. |

## Fluxo De Boot (docker-entrypoint.sh)

Para cada `clientes/<slug>/`:
1. `source config.env` (exporta os tokens).
2. Resolve o Apps Script URL: env `APPS_SCRIPT_URL_<SLUG_MAIÚSCULO>`.
3. Renderiza:
   - se existir `clientes/<slug>/index.html` → usa ele (override total);
   - senão → `envsubst '<lista explícita>' < template > index.html`.
4. `sed` injeta a URL no placeholder `__APPS_SCRIPT_URL__`.
5. Copia logo + relatórios pra raiz web do tenant.
6. Acrescenta `DOMAIN → pasta` no `map`.

Ao final, o `map $host $tenant_root` é escrito em `/etc/nginx/conf.d/00-tenant-map.conf` com `default` = `transbyshop` (catch-all seguro). nginx sobe.

## Niveis De Customizacao Por Cliente

1. **Marca** *(implementado)* — só `config.env`: cores, logo, título, header. Herda correções do motor.
2. **Perguntas** *(roadmap)* — slot `@QUESTIONS@` + `clientes/<slug>/perguntas.html`. Hoje as perguntas são inline e compartilhadas.
3. **Layout total** *(implementado)* — `clientes/<slug>/index.html` próprio. Liberdade total; não herda o motor. É o caminho pro "design individual" por cliente.

## Tokens Do Template

28 tokens preenchidos por `envsubst` (lista explícita no `docker-entrypoint.sh`). Famílias: marca/logo (`COMPANY_NAME`, `LOGO_FILE`, `HEADER_LOGO_FILTER`), paleta (`PRIMARY*`, `ACCENT*`, `BLUSH*`, `TEXT_*`, `BORDER`, `BG`, `REQ_BG`, `SHADOW_RGB`, `HOVER_RGB`, `ARROW`), header (`HEADER_BG/TEXT/EYEBROW/SUB/SUB_STRONG`), CTA (`CTA_BG/TEXT`), estado selecionado (`ON_PRIMARY`), tela de sucesso (`HERO_BG`). A lista canônica = as chaves de `clientes/transbyshop/config.env`.

## Invariante De Parity (CRÍTICO)

A TransbyShop está em produção. O `config.env` dela reproduz os valores **exatos** do HTML original → render **byte-a-byte idêntico**. Qualquer mudança no template deve preservar isso (teste em `QUALITY.md`).

Mecanismo: a tokenização troca *literais* por `${VAR}` (que o `envsubst` devolve ao valor original); **nunca** introduz `var(--novo)` (mudaria o texto e quebraria o diff).

## Integracoes

- **Google Apps Script** (1 web app por cliente): recebe POST do form e a checagem "já respondeu" (GET). URL via env `APPS_SCRIPT_URL_<SLUG>`.
- **Dokploy**: build Docker; múltiplos domínios → 1 container.

## Riscos Arquiteturais

- `envsubst` cego quebraria os template literals do JS — mitigado por **lista explícita** de tokens.
- Cliente sem `APPS_SCRIPT_URL_<SLUG>` → form não envia. O entrypoint loga `!! SEM URL`.
- `config.env` faltando um token → `envsubst` injeta vazio. Manter todos os 28.
- Domínio não mapeado cai no `default` (transbyshop). Conferir o map no log de boot.
