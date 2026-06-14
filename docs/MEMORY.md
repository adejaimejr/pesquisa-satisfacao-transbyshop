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

### Reference

- 

