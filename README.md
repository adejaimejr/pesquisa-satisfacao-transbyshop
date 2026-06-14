# Pesquisa de Satisfação — Plataforma CSAT Multi-Tenant

Motor único que serve um formulário de pesquisa de satisfação (CSAT) **white-label** para vários clientes — cada um no seu domínio, com marca (cores, logo, título) e backend de dados próprios. **Um container, N domínios.**

Validado em produção com a **TransbyShop**; generalizado para multi-cliente.

## Stack

- HTML estático + CSS (sem build, sem Node)
- `nginx:alpine` + `envsubst` (renderiza um `index.html` por cliente no boot)
- Google Apps Script (1 por cliente) → planilha Google
- Deploy: Docker / Dokploy, múltiplos domínios → mesmo container

## Como funciona

1. **1 template** — `engine/pesquisa.template.html`, com tokens `${PRIMARY}`, `${COMPANY_NAME}`, etc.
2. **1 pasta por cliente** — `clientes/<slug>/` com `config.env` (marca + domínio), logo e `relatorios/`.
3. **No boot**, `docker-entrypoint.sh`:
   - renderiza template + `config.env` → `index.html` do cliente (`envsubst`, lista explícita de tokens);
   - injeta o Apps Script URL do cliente (env `APPS_SCRIPT_URL_<SLUG>`) no placeholder `__APPS_SCRIPT_URL__`;
   - copia logo + relatórios;
   - gera o `map $host → pasta` do nginx. `default` = `transbyshop`.

Detalhes em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Estrutura

```
engine/
  pesquisa.template.html   # motor (tokens ${...})
  nginx.conf.template      # server: root $tenant_root
clientes/
  <slug>/
    config.env             # marca + domínio do cliente
    logo.(svg|png)
    relatorios/*.html      # relatórios executivos (autocontidos)
    index.html             # (opcional) design 100% próprio — override do template
docker-entrypoint.sh       # render por cliente + map de domínios
Dockerfile
docs/                      # estrutura multiagente (AGENTS.md + docs/)
```

## Clientes

| Slug | Domínio | Marca |
|---|---|---|
| `transbyshop` | (default / catch-all) | Vinho escuro — **produção, design imutável** |
| `reidasjoias` | `reidasjoias.persua.link` | Pêssego & Ouro |

## Rotas (por domínio)

| URL | Conteúdo |
|---|---|
| `/` | Formulário CSAT do cliente |
| `/relatorio-*.html` | Relatórios executivos do cliente |

## Deploy (Dokploy)

```bash
docker build -t pesquisa-csat .
docker run -p 80:80 \
  -e APPS_SCRIPT_URL_TRANSBYSHOP="https://script.google.com/macros/s/.../exec" \
  -e APPS_SCRIPT_URL_REIDASJOIAS="https://script.google.com/macros/s/.../exec" \
  pesquisa-csat
```

Adicionar os domínios dos clientes ao deploy no Dokploy (todos → o mesmo container).

## Adicionar um cliente novo

Ver [docs/ONBOARDING.md](docs/ONBOARDING.md).

## Para IA / contribuidores

Projeto usa estrutura multiagente. Comece por [AGENTS.md](AGENTS.md) e [docs/ONBOARDING.md](docs/ONBOARDING.md).
