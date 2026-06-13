# TASKS

## Em Andamento

- Nenhuma.

## Proximas Tarefas

- **Deploy (Dokploy):** setar `APPS_SCRIPT_URL_TRANSBYSHOP` e `APPS_SCRIPT_URL_REIDASJOIAS`; adicionar domínio `reidasjoias.persua.link`; rebuild.
- **Apps Script do Rei das Joias:** confirmar se já existe; senão criar web app + planilha do cliente e colar a URL na env var.
- **Domínio de produção da TransbyShop:** confirmar (hoje cai no `default` do map; funciona, mas convém rota explícita).
- **Design individual por cliente** (fase seguinte): tamanho/posição da logo do Rei das Joias; copy das perguntas (hoje herdada da TransbyShop, com termos de varejo — "Troca Express", "Crediário").

## Ideias / Roadmap

- **Nível 2 — perguntas por cliente:** slot `@QUESTIONS@` no template + `clientes/<slug>/perguntas.html` (hoje perguntas inline compartilhadas).
- **Token `--primary-ink`** (cor de texto escura derivada) p/ rigor AA em badges/labels quando `PRIMARY` é tom médio (ex: ouro).
- Página 404 por tenant.

## Concluidas

- Motor multi-tenant (template + config + entrypoint + nginx map + override nível-3). ✓
- Gate de parity da TransbyShop (byte-a-byte). ✓
- Cliente Rei das Joias configurado ("Pêssego & Ouro"). ✓
- Estrutura multiagente (ai-project-structure completa) + docs reais. ✓
