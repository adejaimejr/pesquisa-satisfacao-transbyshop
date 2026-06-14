# QUALITY

## Gate Obrigatório — Parity Da TransbyShop

Antes de qualquer deploy, o render da TransbyShop deve ser **byte-a-byte idêntico** ao HTML de produção. Como a produção segue esse HTML, qualquer divergência é regressão.

Precisa de `envsubst` (`brew install gettext` no mac; já vem no `nginx:alpine`).

```sh
VARS='${COMPANY_NAME} ${LOGO_FILE} ${HEADER_LOGO_FILTER} ${PRIMARY} ${PRIMARY_DARK} ${PRIMARY_GLOW} ${ACCENT} ${ACCENT2} ${BLUSH_LIGHT} ${BLUSH} ${BLUSH_MID} ${TEXT_MAIN} ${TEXT_MUTED} ${BORDER} ${BG} ${REQ_BG} ${SHADOW_RGB} ${HOVER_RGB} ${ARROW} ${HEADER_BG} ${HEADER_TEXT} ${HEADER_EYEBROW} ${HEADER_SUB} ${HEADER_SUB_STRONG} ${ON_PRIMARY} ${CTA_BG} ${CTA_TEXT} ${HERO_BG}'

set -a; . clientes/transbyshop/config.env; set +a
envsubst "$VARS" < engine/pesquisa.template.html | sed 's|__APPS_SCRIPT_URL__||g' > /tmp/render.html

# HTML de produção (recuperar do histórico git — commit single-tenant original):
git show 82c0ee6:pesquisa-transbyshop.html | sed 's|__APPS_SCRIPT_URL__||g' > /tmp/ref.html

diff /tmp/ref.html /tmp/render.html   # deve ser VAZIO
```

## Render De Um Cliente Novo

```sh
set -a; . clientes/<slug>/config.env; set +a
envsubst "$VARS" < engine/pesquisa.template.html > /tmp/<slug>.html
grep -oE '\$\{[A-Z_]+\}' /tmp/<slug>.html   # só ${APPS_SCRIPT_URL} (JS) pode sobrar
```

Conferir: todos os tokens preenchidos; JS literals intactos (`${nome}`, `${encodeURIComponent}`); sem vazamento de cor de outro cliente; contraste AA (ouro/tom médio só em fill, nunca texto pequeno).

## Checklist Geral (multiagente)

- Tarefa atendida, escopo respeitado, nada sobrescrito sem cuidado.
- `SESSION.md` atualizado; `DECISIONS.md` quando houve decisão; `TASKS.md` sincronizado.
- `CLAUDE.md` / `GEMINI.md` só apontam pra `AGENTS.md` (sem regras).

## Criterios De Aceite

- Estrutura clara pra humano e IA.
- **Parity da TransbyShop preservada.**
- Segredos só em env var.
