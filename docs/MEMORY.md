# MEMORY

Memoria persistente do projeto. Aqui ficam fatos consolidados que valem "a partir de agora, sempre" e que se acumulam ao longo do tempo.

## Diferenca Para Outros Arquivos

- `PROJECT_CONTEXT.md`: o que o projeto **e** (estrutural, raramente muda).
- `MEMORY.md`: o que o projeto **aprendeu** (acumula com o tempo).
- `SESSION.md`: o que **aconteceu** em data X (cronologico).
- `DECISIONS.md`: o que foi **decidido** formalmente.

Regra rapida: cronologico vai pro `SESSION.md`. Decisao formal vai pro `DECISIONS.md`. Fato persistente nao-decidido (preferencia, licao, ref externa) vai pro `MEMORY.md`. Estrutural permanente vai pro `PROJECT_CONTEXT.md`.

## Criterio De Promocao

Algo so sai de `SESSION.md` para `MEMORY.md` quando:

- e util para sessoes futuras (nao apenas para a sessao corrente);
- e reutilizavel (nao e detalhe especifico de uma tarefa pontual);
- ja esta consolidado (nao e hipotese ou impressao recente).

Em duvida, deixe em `SESSION.md`. Memoria curta e melhor que memoria errada.

## Sobrescrita Ativa

Fatos podem ficar obsoletos. Quando isso acontecer:

- marque o fato antigo como `~~texto~~ (substituido em AAAA-MM-DD)`;
- adicione o fato novo logo em seguida;
- nao apague o historico — registrar a mudanca ajuda a entender por que mudou.

Se um fato em `MEMORY.md` virar contexto estrutural permanente, promova para `PROJECT_CONTEXT.md` e remova daqui.

## Dados Sensiveis

Nao registre credenciais, tokens, dados pessoais ou informacoes confidenciais. Em duvida, escreva no menor nivel de detalhe util.

## Tipos De Memoria

### User

Quem e o usuario, suas preferencias, contexto e expertise.

Exemplo de entrada: "Usuario prefere portugues claro e respostas curtas."

### Feedback

Guidance de "faca/nao faca isso". Cada item: regra, motivo e quando aplicar.

Exemplo de entrada:

- **Regra:** nao usar mocks em testes de migracao.
- **Por que:** mocks passaram em Q4/2025 mas migracao quebrou em producao.
- **Quando aplicar:** qualquer teste que envolva schema do banco.

### Project

Fatos sobre o projeto descobertos na pratica que nao estao em `PROJECT_CONTEXT.md`.

Exemplo de entrada: "Build em CI exige Node 20.x; 22.x quebra a etapa de bundling."

### Reference

Pointers para sistemas externos.

Exemplo de entrada: "Issues do produto X sao trackeadas no Linear projeto INGEST."

## Registros

### User

- 

### Feedback

- 

### Project

- **Apps Script CSAT — dedup ("já respondeu") quebra por coerção de tipo do Sheets.** `appendRow("2026-01-01")` na coluna `data_venda` faz o Sheets converter a string em `Date`; o `doGet` comparava `String(Date)` (`"Mon Jan 01 2026…"`) com a string da URL e nunca casava → cliente responde infinitas vezes. **Fix que NÃO serve:** forçar a coluna como texto via `setNumberFormat('@')` — lança `"Não é possível definir o formato de número das células em uma coluna com tipo"` em abas com *column type*/Tabela e **aborta o POST** (`ok:false`). **Fix final (v4, validado por curl 2026-06-14 contra a aba estilizada do Rei das Joias):** normalizar só na leitura com `canon_` (`Date → yyyy-MM-dd` via `Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd')`), sem tocar na escrita. Trade-off aceito: não protege `codcliente` com zero à esquerda. Pendente: o snippet de referência nos docs ainda tem o bug; a planilha da TransbyShop em produção pode ter o dedup quebrado se `data_venda` não estiver como texto — verificar sem alterar o motor (invariante de parity).
- **Apps Script CSAT — fix DEFINITIVO do dedup (substitui o `canon_` acima; 2026-06-14, v7).** Copiado da TransbyShop (em produção há tempo, sem o bug — é a fonte da solução). Links reais mandam `data_venda` em `dd/mm/aaaa` e `codcliente` com zeros à esquerda (`0000020466`). (1) `doGet` compara via **`getDisplayValues()`** — o texto exibido na célula já vem `dd/mm/aaaa` (locale pt-BR) e bate com o param cru da URL, sem parse nem lidar com coerção de `Date`. (2) `doPost` grava `codcliente` e `filial` como **texto** via `setFormula('="' + valor + '"')`, preservando os zeros. Requisito: planilha em locale **Brasil**. Validado por curl no rei (display `"13/06/2026"` + `"0000099999"` → dedup `true`). Nuance: o rei usa `getSheetByName('Respostas')` (tem várias abas); a TransbyShop usa `getActiveSheet()`.
- **Apps Script — armadilhas de deploy/teste (onboarding Rei das Joias, 2026-06-14).** (1) Redeploy só vale se **Salvar (Ctrl+S) ANTES** + escolher **"Nova versão"** na implantação existente (mantém a mesma `/exec`); vários redeploys "silenciosos" não pegaram. Pôr sonda `?ping=1 → {pong: VERSION}` no `doGet` e confirmar por curl ANTES de retestar a lógica. (2) `getSheetByName('Respostas')` é match **exato**: se a aba com o visual não se chamar exatamente assim, o script cria uma aba nova vazia e grava nela. (3) curl de POST: **não usar `-X POST`** — força POST no redirect 302→`googleusercontent/echo` (GET-only) → 405 "Drive não pôde abrir"; usar `--data`/`--data-urlencode` sem `-X` (curl baixa pra GET no redirect e lê o JSON).
- **Override Nivel 3 (design individual por cliente) — mecanica.** Se existir `clientes/<slug>/index.html`, o entrypoint serve ele **cru** (`cp`), **sem `envsubst`**; so injeta `__APPS_SCRIPT_URL__` por `sed`. Logo: cores **hardcoded** (nao usa tokens `${...}`), template literals do JS (`${nome}`) ficam intactos, e o arquivo **nao herda** correcoes do template. O Rei das Joias usa esse caminho desde 2026-06-14. Contrato de dados a preservar: campos `satisfacao`, `recompra`, `motivos`, `comentario`, `autorizo` + hidden (`timestamp`, `data_venda`, `codcliente`, `firstname`, `telefone`, `filial`).
- **Dokploy — deploy nao confiavel no 1o push (2026-06-14).** Push em `main` nem sempre dispara o build sozinho; precisou de **Deploy/Rebuild manual** no painel ou re-trigger via commit vazio. Build observado ~1.5-4 min. Confirmar o ar por `curl` com cache-buster (`?_cb=...`) e grep de marcador antes de concluir.
- **Apps Script do Rei — v9 (grava por NOME de coluna) + aba real (2026-06-30).** A aba de respostas do rei chama **`PesquisaSatisfação`** (NAO `Respostas` como dito antes). O **v9** le o header row e grava cada param na coluna com header de mesmo nome -> **independe da ordem**; adicionar/reordenar coluna nao exige mexer no script (o v7/v8 gravavam por indice fixo e deslocavam tudo quando se inseria coluna no meio). `codcliente`/`filial` via `setFormula` (texto, zeros a esquerda); resto `setValue`; dedup no `doGet` acha `codcliente`/`data_venda` por header. Schema atual (11 cols, + `vendedor`): data_venda, codcliente, firstname, telefone, vendedor, filial, satisfacao, motivos, recompra, comentario. Referencia versionada em `clientes/reidasjoias/apps-script.gs`.
- **Apps Script — `/exec` serve a VERSAO IMPLANTADA, nao o ultimo Ctrl+S (2026-06-30).** Redeploy "silencioso" nao pega: tem que **Implantar -> Gerenciar implantacoes -> editar a EXISTENTE (lapis) -> Versao: Nova versao -> Implantar**. Criar "Nova implantacao" gera URL `/exec` NOVA que a pagina nao usa (a pagina aponta pra URL injetada no boot via env `APPS_SCRIPT_URL_REIDASJOIAS`). Teste decisivo: `?ping=1` tem que devolver a `VERSION` esperada (ex. `{"pong":"v9"}`); enquanto vier a versao antiga, o deploy nao trocou.
- **Dedup so e confiavel no SERVIDOR (2026-06-30).** A checagem "ja respondeu" no cliente (GET no onload) NAO e garantia: depende de cache do navegador, rede e do **cold-start do Apps Script (~7,6s medido)**. Em incognito (sem cache + cold) a checagem estoura o timeout -> fail-open -> deixa responder de novo. Fix definitivo: dedup no `doPost` (v10) — checa `codcliente`+`data_venda` ANTES de gravar e NAO grava duplicado (`{ok:true, duplicate:true}`), com `LockService` contra concorrencia. A checagem no cliente vira so UX (timeout subiu 2,5s->10s p/ cobrir o cold-start). Opcional p/ a UX em incognito: ping agendado mantendo o script quente.
- **Dokploy/Docker — build `parent snapshot ... does not exist: not found` = cache corrompido no HOST, nao e o codigo (2026-06-30).** O build passa por todos os COPY/RUN e falha so na extracao/unpack da imagem (containerd snapshotter). Fix: Redeploy (quase sempre transitorio) ou no host `docker builder prune -af` + `docker system prune -af`, ou `systemctl restart docker`. Nada a mudar no repo.

### Reference

- 

