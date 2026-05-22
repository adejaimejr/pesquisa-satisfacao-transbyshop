# Pesquisa de Satisfação - TransbyShop

Formulário de pesquisa de satisfação (CSAT) para clientes da TransbyShop, com relatórios executivos consolidados por período.

## Stack

- HTML estático + CSS
- nginx:alpine (Docker)
- Google Apps Script para receber as respostas

## Rotas servidas

| URL | Conteúdo |
|---|---|
| `/` | Formulário de pesquisa (`pesquisa-transbyshop.html`) |
| `/relatorio-<slug>.html` | Relatórios executivos da pasta `relatorios/` (autocontidos) |

Exemplo: `dominio.com/relatorio-transbyshop-13mar-18mai-2026.html`

## Como funciona

### Pesquisa
1. O cliente acessa a URL com parâmetros (firstname, codcliente, filial, telefone, data_venda)
2. Avalia de 1 a 5 estrelas e pode deixar comentários
3. Os dados são enviados para uma planilha Google via Apps Script

### Relatórios
Cada arquivo `relatorios/relatorio-*.html` é um relatório executivo autocontido (sem dependência de assets externos — logo embutido em base64). Basta adicionar um novo HTML na pasta e ele aparece automaticamente em `/<nome-do-arquivo>.html` após o próximo build.

## Deploy

O projeto roda via Docker com nginx. O `docker-entrypoint.sh` injeta a variável de ambiente `APPS_SCRIPT_URL` no HTML do formulário antes de iniciar o nginx (os relatórios não recebem injeção).

```bash
docker build -t pesquisa-transbyshop .
docker run -e APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec -p 80:80 pesquisa-transbyshop
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `APPS_SCRIPT_URL` | URL do Google Apps Script (web app) |
