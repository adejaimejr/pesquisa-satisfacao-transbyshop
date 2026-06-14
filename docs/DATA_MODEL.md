# DATA_MODEL

## Entidades

### Resposta CSAT (enviada ao Apps Script)

- Descrição: payload do formulário, via POST `FormData` pro Apps Script do cliente.
- Campos:
  - `timestamp` (ISO), `data_venda`, `codcliente`, `firstname`, `telefone`, `filial` — vêm dos parâmetros da URL.
  - `satisfacao` (1–5, obrigatório)
  - `motivos` (CSV dos chips selecionados, obrigatório)
  - `recompra` (`Sim` / `Talvez` / `Não`, obrigatório)
  - `comentario` (texto, opcional)
  - `autorizo` (LGPD, obrigatório pra enviar)
- Regras: checagem "já respondeu" por `codcliente` + `data_venda` (GET ao Apps Script, 3 retries com timeout).

### Tenant (cliente)

- Descrição: definido por `clientes/<slug>/config.env`.
- Campos: `DOMAIN`, `COMPANY_NAME`, `LOGO_FILE`, `HEADER_LOGO_FILTER`, paleta (28 tokens).
- Segredo (fora do config, no deploy): `APPS_SCRIPT_URL_<SLUG>`.
- Relações: 1 tenant → 1 Apps Script/planilha → 1+ domínios (mapeados no nginx).

## Parametros De URL (entrada da pesquisa)

`?firstname=&codcliente=&filial=&telefone=&data_venda=` — preenchem campos ocultos e personalizam o eyebrow. Removidos da URL após carregar (`history.replaceState`).

## Migracoes Ou Mudancas

- 2026-06-13: HTML single-tenant → template tokenizado + `config.env` por cliente. Sem mudança no payload nem no contrato do Apps Script.
