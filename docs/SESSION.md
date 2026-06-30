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

## 2026-06-30 - Claude (Opus 4.8)

### Objetivo

Reuniao multi-squad (design/brand/c-level/advisory/anti-slop) para melhorar o design da pesquisa do Rei das Joias e implementar o redesign individual em producao, sem tocar na TransbyShop. Depois: gerar o link (n8n/Shlink), adicionar o campo `vendedor` e blindar o dedup.

### O Que Foi Feito

- **Reuniao de chiefs (com votos):** convergencia em (A) trocar emojis por iconografia propria, (B) ramificar tela de sucesso, (C) recuperar detrator, (D) contraste AA. Diagnostico: "vitrine linda, caixa fechado".
- **Redesign Nivel 3:** criado `clientes/reidasjoias/index.html` (override total). Carinhas em linha (SVG) no lugar de emoji; chips/recompra com icones SVG; "Nao" neutro (sem vermelho); contraste AA; header com filete de ouro; estado selecionado com gradiente + brilho; acessibilidade (inputs reais sr-only, foco, aria-label); `replaceState` protegido.
- **Iteracoes com o cliente (em producao):** nota com carinhas (descartadas as gemas douradas); "Troca Express" -> "Troca" (casa com o Sheet ja ajustado pelo cliente); telas finais escuro -> claro (creme + ouro); **removido o roteamento Google/WhatsApp** -> tela unica "Sua opiniao foi registrada!"; copy encurtada; selo removido; CSS morto varrido (.success-cta/stars/secondary/tag, vars --hero).
- **Deploy:** commits em `main`; Dokploy buildou (rebuild manual/re-trigger; ~1.5-4 min). Verificado por curl: redesign no ar em `reidasjoias.persua.link`; parity da TransbyShop intacta (diff vazio, 919=919) a cada push.
- **Refino visual (em prod):** nota selecionada colorida por sentimento (1 vermelho -> 5 verde, 3 dourado, via `:has()` + fallback ouro); chip/recompra selecionado unificado ao ouro do botao CTA.
- **n8n / Shlink (geracao do link):** orientado o cliente — a API do Shlink fica em `persua.link` (mesmo host da TransbyShop), NAO em `reidasjoias.persua.link` (esse e o host do FORM, devolve HTML). Entre clientes muda so o `longUrl` (alvo) -> `reidasjoias.persua.link/?params`. `/visits` so LE; criar e POST `/rest/v3/short-urls`.
- **Campo `vendedor`:** add no link + na pagina (hidden field + leitura URL) + no Apps Script.
- **Apps Script v7 -> v10 (saga vendedor + dedup):** (1) v8 posicional deslocava tudo porque o cliente pos a coluna `vendedor` no meio; (2) v9 passa a gravar **por NOME de coluna** (header-mapped) -> ordem nao importa; (3) descoberto que a aba real e **`Respostas`** (nao `PesquisaSatisfacao`) e que `/exec` serve a VERSAO IMPLANTADA (Ctrl+S nao basta -> "Nova versao"); (4) validado por POST de teste (rows 3->4, dedup true).
- **Dedup — fix em 2 camadas:** (a) timeout da checagem no cliente 2,5s -> 10s (Apps Script tem cold-start ~7,6s; 2,5s caia no fail-open e deixava responder 2x); (b) **dedup DEFINITIVO no servidor** (v10 `doPost` checa codcliente+data_venda antes de gravar e NAO grava duplicado, + `LockService`). A checagem no cliente nunca e garantia (falha em incognito/cache/cold-start).
- **Referencia versionada:** `clientes/reidasjoias/apps-script.gs` (v10) — deploy e MANUAL no editor do Google (git nao alcanca o Apps Script).

### Arquivos Criados Ou Alterados

- Novos: `clientes/reidasjoias/index.html`, `clientes/reidasjoias/apps-script.gs` (referencia v10).
- Docs: `SESSION.md`, `DECISIONS.md`, `TASKS.md`, `CHANGELOG.md`, `MEMORY.md`.

### Decisoes Tomadas

Ver `DECISIONS.md`: redesign via override Nivel 3 (nao tokenizar o template); header mantem pessego + craft (rejeita borgonha); tela de sucesso unica (reverte o roteamento por nota).

### Aprendizados Para MEMORY.md

- Override Nivel 3 nao passa por `envsubst` (cp cru + `sed` so do `__APPS_SCRIPT_URL__`); cores hardcoded; nao herda correcoes do template.
- Dokploy nao sobe sozinho de forma confiavel no 1o push; precisa Deploy/Rebuild (ou re-trigger por commit vazio); build ~1.5-4 min.

### Pendencias

- **Deploy do Apps Script v10** (dedup server-side): cliente precisa colar o v10 no editor + "Nova versao"; confirmar `?ping=1 -> {pong:'v10'}` + teste de duplo-envio (2o POST deve voltar `duplicate:true` sem subir linha).
- **Dokploy build error** (`parent snapshot ... does not exist`): cache de build corrompido no host. Fix: Redeploy (transitorio) ou `docker builder prune -af`/`docker system prune -af`/restart docker. Nao e o codigo (build passou; falhou na extracao da imagem). Bloqueia subir mudancas de PAGINA ate limpar.
- **UX incognito (opcional):** com v10 o dado fica seguro, mas a pagina ainda pode mostrar o form em incognito (checagem do cliente falha no cold-start). Polir: (a) pagina ler a flag `duplicate` no POST [precisa Dokploy] ou (b) ping agendado no n8n mantendo o Apps Script quente.
- Limpeza: apagar linhas de teste da planilha do rei (TESTE0001, EDILON desalinhada do v7, CLAUDETEST1).
- Task #6 (alerta interno de detrator) parkado/opcional. Pendencias antigas da TransbyShop seguem.

### Proximo Passo Recomendado

- Cliente: deployar o **Apps Script v10** (Nova versao) e chamar p/ testar o duplo-envio. Em paralelo, resolver o **build do Dokploy** (prune + redeploy) p/ liberar futuras mudancas de pagina. Redesign + vendedor + dedup estao prontos no codigo (`main`).

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
