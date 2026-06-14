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

## 2026-06-14 - Claude (Opus 4.8)

### Objetivo

Executar as pendências de operador da plataforma multi-tenant: (A) Apps Script do Rei das Joias e (B) deploy no Dokploy, sem quebrar a TransbyShop em produção.

### O Que Foi Feito

- **Task A (Apps Script rei):** validado end-to-end por curl. Corrigidos 3 bugs no Code.gs de referência: (1) coerção de `data_venda` formato-data p/ `Date` quebrava o dedup → `canon_` normaliza na leitura; (2) `setNumberFormat('@')` estourava em aba com column type → removido; (3) coluna `autorizo` transbordava → removida (consentimento implícito). Sonda `?ping`/`?headers` adicionada p/ confirmar deploy.
- **Task B (deploy Dokploy):** Dokploy não respeitava a troca de branch (buildava `main` teimosamente). Decisão: merge `feat/multi-tenant`→`main` (reconciliado com o PR#1 já em origin/main) e deploy de `main`. Motor subiu, map correto, ambos tenants `apps_script=ok` após acertar as env vars.
- **Verificação HTTPS:** reidasjoias.persua.link (Pêssego, /exec do rei) e pesquisa.transbyshop.com.br (vinho, /exec própria) corretos, sem cross-contaminação, placeholder 0.

### Arquivos Criados Ou Alterados

- `docs/MEMORY.md`, `docs/SESSION.md`, `docs/TASKS.md`.
- Merge `feat/multi-tenant`→`main` (motor em produção; engine inalterado, parity mantido).

### Decisoes Tomadas

- Deploy de `main` (não da branch) — Dokploy não trocava de branch.
- `autorizo` fora da planilha; dedup robusto por normalização na leitura (não por formatação de coluna).

### Aprendizados Para MEMORY.md

- Promovidos: coerção de data no dedup + armadilhas de deploy do Apps Script (ver MEMORY.md).

### Pendencias

- **Outage TransbyShop ~14:11–14:17** (env `SEM URL`): form não enviava; carga real às 14:12 (codcliente `0000020466`). Conferir planilha / contatar.
- Remover probes `?ping`/`?headers` do Apps Script (v6) se quiser produção limpa; limpar linhas `TESTE*`.
- Verificar dedup da TransbyShop em produção (mesma coerção de data?), sem tocar no motor.
- Snippet de referência nos docs ainda com os bugs do Apps Script.
- Design individual por cliente (fase seguinte).

### Proximo Passo Recomendado

- Qualquer agente com contexto: confirmar submit real nos 2 forms; depois fase de design individual. Avaliar rota de branch explícita no Dokploy vs manter deploy de `main`.

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
