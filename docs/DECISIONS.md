# DECISIONS

## 2026-06-14 - Redesign do Rei das Joias via override Nivel 3

### Decisao
O redesign individual do Rei das Joias vive em `clientes/reidasjoias/index.html` (override Nivel 3), nao no template compartilhado.
### Motivo
Parity da TransbyShop e byte-a-byte; mexer no template arriscaria producao. O override e servido cru (sem `envsubst`), isolado, e ja era o caminho previsto para design individual.
### Impacto
Cores hardcoded (nao usa tokens `${...}`). Nao herda correcoes do template. So `__APPS_SCRIPT_URL__` e injetado. Contrato de dados preservado (satisfacao/recompra/motivos/comentario/autorizo + hidden).

## 2026-06-14 - Header do Rei das Joias: mantem pessego + craft (rejeita borgonha)

### Decisao
Manter o header pessego `#FEE5DB` e adicionar autoridade por craft (filete de ouro, contraste AA, iconografia propria), em vez de trocar para header escuro/borgonha.
### Motivo
Posicionamento real e joalheria acessivel (crediario, troca, preco em destaque), nao alta joalheria; o pessego foi cor escolhida pelo cliente e passa AA. Reversivel/A-B se necessario.
### Impacto
Estetica clara e coesa em toda a tela (form + telas finais claras creme+ouro).

## 2026-06-14 - Tela de sucesso unica (reverte roteamento por nota)

### Decisao
Apos enviar, todos veem uma unica tela clara "Sua opiniao foi registrada!". Removido o roteamento promotor->Google / detrator->WhatsApp.
### Motivo
Pedido do cliente por UX mais simples. Contraria a recomendacao do board (capturar review / recuperar detrator) — trade-off de ROI aceito pelo dono.
### Impacto
Sem CTAs Google/WhatsApp na pagina. O alerta interno de detrator (server-side) fica como tarefa opcional (#6).

## 2026-06-13 - Arquitetura multi-tenant: 1 motor + pasta por cliente

### Decisao
Template único (`engine/pesquisa.template.html`) com tokens; 1 pasta `clientes/<slug>/` por cliente; roteamento nginx por `$host`.
### Motivo
DRY (corrige bug uma vez), parity da produção preservada, Dokploy aceita N domínios → 1 container.
### Impacto
Marca vira `config.env`. Adicionar cliente = criar pasta + env var + domínio.

## 2026-06-13 - Parity por placeholder (não var())

### Decisao
A tokenização troca literais por `${VAR}` que o `envsubst` devolve ao valor original; nunca introduz `var(--novo)`.
### Motivo
Manter o render da TransbyShop byte-a-byte idêntico (var() mudaria o texto e quebraria o diff).
### Impacto
Gate de parity (diff vazio) obrigatório antes de qualquer deploy.

## 2026-06-13 - envsubst com lista explícita de tokens

### Decisao
`envsubst` recebe a lista exata dos 28 tokens; `APPS_SCRIPT_URL` é injetado por `sed`.
### Motivo
`envsubst` cego quebraria os template literals do JS (`${nome}`, `${APPS_SCRIPT_URL}`, `${encodeURIComponent}`).
### Impacto
Novos tokens precisam ser adicionados à lista (`VARS`) no entrypoint.

## 2026-06-13 - Dados isolados por cliente

### Decisao
1 Apps Script/planilha por cliente; URL via env `APPS_SCRIPT_URL_<SLUG>` (fora do repo).
### Motivo
Dados de CSAT não podem misturar entre clientes; segredo não vai pro git.
### Impacto
Onboarding inclui criar o web app e setar a env var no Dokploy.

## 2026-06-13 - Design do Rei das Joias: "Pêssego & Ouro"

### Decisao
Header pêssego `#FEE5DB` + logo preta + acentos/CTA ouro `#C6A15B` (texto escuro) + texto bronze.
### Motivo
Mais "joalheria de luxo" das opções claras; usa as cores fornecidas pelo cliente (`#FEE5DB`, `#CA9A8E`) + dourados; passa contraste AA (ouro só em fill, nunca como texto).
### Impacto
Valores em `clientes/reidasjoias/config.env`.

## 2026-06-13 - Override de layout por cliente (nível 3)

### Decisao
Se `clientes/<slug>/index.html` existir, o motor serve ele cru (só injeta a URL).
### Motivo
Permitir design 100% próprio por cliente na fase de design individual.
### Impacto
O HTML override deve manter `__APPS_SCRIPT_URL__`. Não herda correções do template.
