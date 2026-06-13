# ONBOARDING

## Para Humanos

1. `README.md` — visão geral.
2. `docs/PROJECT_CONTEXT.md` — o que o projeto é.
3. `docs/ARCHITECTURE.md` — como o motor funciona.
4. `docs/TASKS.md` — o que está em aberto.
5. `docs/SESSION.md` — o que a IA fez por último.

## Para Agentes De IA

1. Leia `../AGENTS.md` e siga a ordem de leitura.
2. Antes de mexer no motor, leia a **invariante de parity** em `ARCHITECTURE.md` / `QUALITY.md`.
3. Atualize `SESSION.md` após trabalho relevante.

## Adicionar Um Cliente Novo (nível 1 — marca)

1. Crie `clientes/<slug>/` — slug minúsculo, sem espaço (vira o nome da env var e da rota interna).
2. Crie `clientes/<slug>/config.env` — copie de `clientes/reidasjoias/config.env` e ajuste:
   - `DOMAIN` = domínio do cliente (ex: `cliente.persua.link`).
   - `COMPANY_NAME`, `LOGO_FILE`.
   - `HEADER_LOGO_FILTER`: `none` (logo já combina com o header) ou `brightness(0) invert(1)` (inverte logo preta pra branca em header escuro).
   - paleta — **todos os 28 tokens, nenhum vazio**.
3. Coloque a logo em `clientes/<slug>/<LOGO_FILE>`.
4. (Opcional) relatórios em `clientes/<slug>/relatorios/*.html`.
5. **Crie o Google Apps Script** do cliente (web app próprio → planilha do cliente) e copie a URL `.../exec`.
6. No **Dokploy**:
   - env var `APPS_SCRIPT_URL_<SLUG_MAIÚSCULO>` = a URL do passo 5 (slug `reidasjoias` → `APPS_SCRIPT_URL_REIDASJOIAS`);
   - adicione o domínio do cliente ao deploy.
7. Rebuild/redeploy. Confira o log de boot: `[tenant] <slug> ... apps_script=ok`.

### Checklist de contraste (WCAG)

Ouro e tons médios falham como **texto** sobre fundo claro. Reserve o tom de marca pra fills/acentos e use cor escura pro texto. CTA precisa de ≥4.5:1.

### Validar o render

Antes de subir, rode o teste de render em `QUALITY.md` (todos os tokens preenchidos, JS intacto, sem vazamento de outro cliente).

## Design Individual Por Cliente (nível 3 — layout próprio)

Quando o cliente quiser uma página totalmente diferente: crie `clientes/<slug>/index.html`. O motor serve ele cru e só injeta `__APPS_SCRIPT_URL__` — o HTML **deve** conter esse placeholder. Não herda correções do template.

## Primeira Configuracao (já feita)

- Objetivo/público em `PROJECT_CONTEXT.md` ✓
- Arquitetura em `ARCHITECTURE.md` ✓
- Gate/validação em `QUALITY.md` ✓
