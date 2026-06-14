# TASKS

## Em Andamento

- Nenhuma.

## Proximas Tarefas

- **Outage TransbyShop (verificar perda):** entre ~14:11–14:17 de 2026-06-14 o deploy multi-tenant ficou com env `SEM URL` e o form não enviava; houve carga real (codcliente `0000020466`, 14:12). Conferir a planilha e recontatar se faltar resposta.
- **Apps Script — limpeza:** remover linhas `TESTE*` da planilha do rei; remover probes `?ping`/`?headers` do `Code.gs` (v6) se quiser produção limpa.
- **Dedup TransbyShop em produção:** verificar se a planilha sofre da mesma coerção de data que quebrava o "já respondeu" — sem alterar o motor (invariante de parity).
- **Snippet de referência (docs):** o `Code.gs` de exemplo ainda tem os bugs corrigidos nesta sessão; atualizar.
- **Domínio TransbyShop:** `pesquisa.transbyshop.com.br` confirmado; serve pelo `default` do map (funciona). Rota explícita é opcional.
- **Design individual por cliente** (fase seguinte): tamanho/posição da logo do Rei das Joias; copy das perguntas (hoje herdada da TransbyShop, com termos de varejo — "Troca Express", "Crediário").

## Ideias / Roadmap

- **Nível 2 — perguntas por cliente:** slot `@QUESTIONS@` no template + `clientes/<slug>/perguntas.html` (hoje perguntas inline compartilhadas).
- **Token `--primary-ink`** (cor de texto escura derivada) p/ rigor AA em badges/labels quando `PRIMARY` é tom médio (ex: ouro).
- Página 404 por tenant.

## Concluidas

- **Apps Script do Rei das Joias** — web app + planilha, contrato validado por curl, 3 bugs corrigidos (coerção de data, column-type, autorizo). ✓ (2026-06-14)
- **Deploy Dokploy** — merge `feat/multi-tenant`→`main`, motor em produção; reidasjoias.persua.link + pesquisa.transbyshop.com.br servindo correto, ambos `apps_script=ok`. ✓ (2026-06-14)
- Motor multi-tenant (template + config + entrypoint + nginx map + override nível-3). ✓
- Gate de parity da TransbyShop (byte-a-byte). ✓
- Cliente Rei das Joias configurado ("Pêssego & Ouro"). ✓
- Estrutura multiagente (ai-project-structure completa) + docs reais. ✓
