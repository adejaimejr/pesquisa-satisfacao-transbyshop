# SESSION

Registro cronológico inverso das sessões de IA. Sessão mais recente no topo.

## Modelo Para Nova Sessao

```md
## AAAA-MM-DD - Nome do agente
### Objetivo
### O Que Foi Feito
### Arquivos Criados Ou Alterados
### Decisoes Tomadas
### Aprendizados Para MEMORY.md
### Pendencias
### Proximo Passo Recomendado
```

## 2026-06-13 - Claude (Opus 4.8)

### Objetivo

Transformar o projeto single-tenant (TransbyShop) em plataforma CSAT multi-tenant (1 motor, N domínios) **sem alterar a TransbyShop em produção**, e implantar a estrutura multiagente.

### O Que Foi Feito

- Tokenizado o HTML em `engine/pesquisa.template.html` (28 tokens `${...}`; perguntas inline).
- Motor multi-tenant: `docker-entrypoint.sh` (render por cliente via `envsubst` lista-explícita + injeção de URL + `map $host` + override nível-3), `engine/nginx.conf.template`, `Dockerfile` reescrito.
- Clientes: `transbyshop` (valores exatos = parity) e `reidasjoias` (design "Pêssego & Ouro", `reidasjoias.persua.link`).
- **Gate de parity**: render da TransbyShop = HTML original byte-a-byte (diff vazio, 919=919 linhas).
- Estrutura multiagente (ai-project-structure, completa) + docs reais.
- Removidos arquivos-raiz redundantes (`pesquisa-transbyshop.html`, `relatorios/`, `logo-1.svg`) — conteúdo migrou pra `clientes/transbyshop/`, é reproduzido pelo motor e está no histórico git (commit `82c0ee6`).

### Arquivos Criados Ou Alterados

- Novos: `engine/`, `clientes/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/*`.
- Alterados: `Dockerfile`, `docker-entrypoint.sh`, `README.md`.
- Removidos: `pesquisa-transbyshop.html`, `relatorios/`, `logo-1.svg` (raiz).

### Decisoes Tomadas

Ver `DECISIONS.md`: multi-tenant template+config; parity por placeholder; dados por cliente; design Opção 5 do Rei das Joias; override nível-3.

### Aprendizados Para MEMORY.md

- A TransbyShop está em produção e segue o HTML single-tenant; manter o render byte-idêntico é invariante do projeto.

### Pendencias

Ver `TASKS.md`: deploy Dokploy (env vars + domínios), Apps Script do Rei das Joias, design individual por cliente, slot de perguntas (nível 2).

### Proximo Passo Recomendado

- Qualquer agente com contexto: commitar a branch `feat/multi-tenant`, depois deploy. Design individual por cliente é a fase seguinte.
