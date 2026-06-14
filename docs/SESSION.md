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

## 2026-06-14 (sessao 2) - Claude (Opus 4.8)

### Objetivo

Reuniao multi-squad (design/brand/c-level/advisory/anti-slop) para melhorar o design da pesquisa do Rei das Joias e implementar o redesign individual em producao, sem tocar na TransbyShop.

### O Que Foi Feito

- **Reuniao de chiefs (com votos):** convergencia em (A) trocar emojis por iconografia propria, (B) ramificar tela de sucesso, (C) recuperar detrator, (D) contraste AA. Diagnostico: "vitrine linda, caixa fechado".
- **Redesign Nivel 3:** criado `clientes/reidasjoias/index.html` (override total). Carinhas em linha (SVG) no lugar de emoji; chips/recompra com icones SVG; "Nao" neutro (sem vermelho); contraste AA; header com filete de ouro; estado selecionado com gradiente + brilho; acessibilidade (inputs reais sr-only, foco, aria-label); `replaceState` protegido.
- **Iteracoes com o cliente (em producao):** nota com carinhas (descartadas as gemas douradas); "Troca Express" -> "Troca" (casa com o Sheet ja ajustado pelo cliente); telas finais escuro -> claro (creme + ouro); **removido o roteamento Google/WhatsApp** -> tela unica "Sua opiniao foi registrada!"; copy encurtada; selo removido; CSS morto varrido (.success-cta/stars/secondary/tag, vars --hero).
- **Deploy:** commits em `main`; Dokploy buildou (rebuild manual/re-trigger; ~1.5-4 min). Verificado por curl: redesign no ar em `reidasjoias.persua.link`; parity da TransbyShop intacta (diff vazio, 919=919) a cada push.

### Arquivos Criados Ou Alterados

- Novo: `clientes/reidasjoias/index.html`.
- Docs: `SESSION.md`, `DECISIONS.md`, `TASKS.md`, `CHANGELOG.md`, `MEMORY.md`.

### Decisoes Tomadas

Ver `DECISIONS.md`: redesign via override Nivel 3 (nao tokenizar o template); header mantem pessego + craft (rejeita borgonha); tela de sucesso unica (reverte o roteamento por nota).

### Aprendizados Para MEMORY.md

- Override Nivel 3 nao passa por `envsubst` (cp cru + `sed` so do `__APPS_SCRIPT_URL__`); cores hardcoded; nao herda correcoes do template.
- Dokploy nao sobe sozinho de forma confiavel no 1o push; precisa Deploy/Rebuild (ou re-trigger por commit vazio); build ~1.5-4 min.

### Pendencias

- Task #6 (alerta interno de detrator no Apps Script, nota<=3) parkado/opcional — cliente simplificou o lado publico.
- Pendencias antigas seguem (outage TransbyShop, limpeza de probes/linhas TESTE, snippet de referencia do Apps Script com bug, dedup TransbyShop em producao).

### Proximo Passo Recomendado

- Qualquer agente com contexto: se quiser reativar valor de CRM, implementar o alerta interno de detrator (#6) no `Code.gs` (server-side, independe da tela). Caso contrario, o redesign do rei esta fechado e em producao.

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
