# Pesquisa de Satisfação - TransbyShop

Formulário de pesquisa de satisfação (CSAT) para clientes da TransbyShop.

## Stack

- HTML estático + CSS
- nginx:alpine (Docker)
- Google Apps Script para receber as respostas

## Como funciona

1. O cliente acessa a URL com parâmetros (firstname, codcliente, filial, telefone, data_venda)
2. Avalia de 1 a 5 estrelas e pode deixar comentários
3. Os dados são enviados para uma planilha Google via Apps Script

## Deploy

O projeto roda via Docker com nginx. O `docker-entrypoint.sh` injeta a variável de ambiente `APPS_SCRIPT_URL` no HTML antes de iniciar o nginx.

```bash
docker build -t pesquisa-transbyshop .
docker run -e APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec -p 80:80 pesquisa-transbyshop
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `APPS_SCRIPT_URL` | URL do Google Apps Script (web app) |
