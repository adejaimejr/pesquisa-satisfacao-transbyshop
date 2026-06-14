# Próxima sessão — Design individual do Rei das Joias (100%)

> Cole este arquivo inteiro como prompt inicial da próxima sessão. Autocontido.

## Context

Projeto em `/Users/adejaimejunioer/Desktop/dev-icloud/2026/pesquisa-satisfacao-transbyshop`.

Plataforma CSAT multi-tenant: 1 motor (`nginx:alpine` + shell), 1 pasta por cliente em `clientes/<slug>/`, roteamento por domínio (`map $host`). No boot, `docker-entrypoint.sh` renderiza `engine/pesquisa.template.html` + `clientes/<slug>/config.env` via `envsubst`, injeta o Apps Script URL no placeholder `__APPS_SCRIPT_URL__`, e gera o nginx map.

Estado (após 2026-06-14): **backend + deploy 100% no ar e validados**.

- `main` é a branch de deploy (Dokploy builda `main`). **2 commits de docs locais não pushados** (`9593e51`, `789cede`) — pushar nesta sessão.
- **TransbyShop:** `pesquisa.transbyshop.com.br`, design vinho, **APROVADO em produção**.
- **Rei das Joias:** `reidasjoias.persua.link`, design "Pêssego & Ouro" (só recoloração via tokens). Apps Script + planilha próprios funcionando, **dedup robusto** (v7: `getDisplayValues()` + `setFormula` texto — trata `dd/mm/aaaa` e zeros à esquerda). Schema 10 colunas, sem `autorizo`. (Script ainda tem probes temporárias `?ping`/`?debug` — podem ser removidas num v8 limpo.)

## Goal

Deixar o **Rei das Joias 100%** — design/UX de joalheria premium, não uma TransbyShop recolorida. Logo, copy das perguntas, motivos, visual, telas de sucesso/"já respondeu", mobile, acessibilidade.

## Invariante — NÃO TOCAR NA TRANSBYSHOP

Aprovada e em produção. O motor `engine/pesquisa.template.html` é **compartilhado** — mexer nele afeta a TransbyShop e quebra o gate de parity (`docs/QUALITY.md`, render byte-a-byte idêntico ao original).

→ Individualize o rei por **override de cliente**, sem tocar no template:

**Override (nível 3, já suportado):** se existir `clientes/reidasjoias/index.html`, o `docker-entrypoint.sh` usa esse arquivo **no lugar** do template renderizado (design individual total, opt-in). Depois ainda injeta o `__APPS_SCRIPT_URL__` via `sed`.

**Ponto de partida recomendado:** gere `clientes/reidasjoias/index.html` a partir do **render atual** do rei (template + `config.env`, usando a lista `$VARS` do `docker-entrypoint.sh` no `envsubst`) e redesenhe por cima. O contrato do form já vem intacto — você só restila/recopia. Mantenha o placeholder `__APPS_SCRIPT_URL__` **literal**.

## Contrato form ↔ Apps Script (PRESERVAR — senão o backend para)

Apps Script do rei deployado (v7) e validado. O override DEVE manter:

- Placeholder `__APPS_SCRIPT_URL__` literal.
- **GET** `…/exec?codcliente=X&data_venda=Y` → `{already_responded: bool}` (3 retries, timeout 3s) → tela "já respondeu".
- **POST** FormData, 10 campos: `timestamp` (ISO), `data_venda`, `codcliente`, `firstname`, `telefone`, `filial`, `motivos` (CSV), `satisfacao` (1–5), `recompra` (`Sim`/`Talvez`/`Não`), `comentario`.
- **Params de URL** do link: `firstname`, `codcliente`, `data_venda`, `filial`, `telefone`. Formato real: `data_venda` em **dd/mm/aaaa**, `codcliente` com zeros à esquerda. (O Apps Script já lida com isso via `getDisplayValues()` + `setFormula`.)

⚠️ **Acoplamento:** mudar **campos/perguntas** (add/remove) exige mexer no Apps Script (`HEADERS`/colunas) + planilha juntos + revalidar dedup. Mudar só **copy/labels/opções de motivos** (mesmos campos) não afeta o backend.

## Escopo (o "100%")

- **Logo:** tamanho/posição premium (hoje `logo.png`, filtro `none`).
- **Copy + motivos:** hoje herdados da TransbyShop (varejo: "Troca Express", "Crediário"). Trocar por linguagem de **joalheria** (variedade de peças, acabamento/qualidade, atendimento, garantia, design, confiança). Confirmar os motivos reais com o cliente.
- **Visual:** identidade joalheria premium na paleta Pêssego & Ouro — tipografia, espaçamento, hierarquia, micro-interações, hero.
- **Telas:** sucesso e "já respondeu" no mesmo padrão.
- **Mobile-first** (respondente abre por link no WhatsApp).
- **Acessibilidade AA:** contraste, especialmente ouro `#C6A15B` sobre claro. Considerar token `--primary-ink` (texto escuro derivado) p/ labels/badges.
- Pode usar as skills `design-arsenal` / `brand-squad` / `copy-squad`.

## Deploy / teste

- Testar o render **localmente** antes (docker build + run; abrir o index gerado do rei).
- Subir: commitar em `main` + push (junto dos 2 commits de docs pendentes) → Dokploy builda `main`.
- Pós-deploy: abrir `https://reidasjoias.persua.link/` (design novo) + 1 submit real → planilha do rei; reabrir mesma URL → "já respondeu". **E conferir que `pesquisa.transbyshop.com.br` continua idêntica** (regressão).

## Critical files

- `engine/pesquisa.template.html` — template compartilhado (REFERÊNCIA; base do override; **não alterar** se afetar TransbyShop).
- `clientes/reidasjoias/config.env` — tokens Pêssego & Ouro + logo + domínio.
- `clientes/reidasjoias/index.html` — **criar** (override do design).
- `docker-entrypoint.sh` — override + injeção de URL (entender, não mudar).
- `docs/QUALITY.md`, `docs/ARCHITECTURE.md`, `docs/ONBOARDING.md`.

## Ordem de leitura (AGENTS.md)

`docs/README.md` → `PROJECT_CONTEXT.md` → `SESSION.md` (2026-06-14) → `MEMORY.md` → `TASKS.md` → `ARCHITECTURE.md` → `QUALITY.md`.

## Fora de escopo

- **TransbyShop** (aprovada — não tocar; manter parity).
- Backend/Apps Script do rei (pronto), salvo mudança de campos do form.
- Outros clientes / novo onboarding.
