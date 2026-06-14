# TASKS

## Em Andamento

- Nenhuma.

## Proximas Tarefas

- **Outage TransbyShop (verificar perda):** entre ~14:11–14:17 de 2026-06-14 o deploy multi-tenant ficou com env `SEM URL` e o form não enviava; houve carga real (codcliente `0000020466`, 14:12). Conferir a planilha e recontatar se faltar resposta.
- **Apps Script — limpeza:** remover linhas `TESTE*` da planilha do rei; remover probes `?ping`/`?headers` do `Code.gs` (v6) se quiser produção limpa.
- **Dedup TransbyShop em produção:** verificar se a planilha sofre da mesma coerção de data que quebrava o "já respondeu" — sem alterar o motor (invariante de parity).
- **Snippet de referência (docs):** o `Code.gs` de exemplo ainda tem os bugs corrigidos nesta sessão; atualizar.
- **Domínio TransbyShop:** `pesquisa.transbyshop.com.br` confirmado; serve pelo `default` do map (funciona). Rota explícita é opcional.
- **Alerta interno de detrator (opcional, #6):** Apps Script dispara aviso ao gestor quando nota<=3 (nome/telefone/motivos). Parkado: o cliente optou por tela de sucesso unica, sem roteamento publico Google/WhatsApp; este aviso e server-side e independe da tela.

## Ideias / Roadmap

- **Nível 2 — perguntas por cliente:** slot `@QUESTIONS@` no template + `clientes/<slug>/perguntas.html` (hoje perguntas inline compartilhadas).
- **Token `--primary-ink`** (cor de texto escura derivada) p/ rigor AA em badges/labels quando `PRIMARY` é tom médio (ex: ouro).
- Página 404 por tenant.

## Concluidas

- **Redesign individual do Rei das Joias** — override Nivel 3 (`clientes/reidasjoias/index.html`): carinhas no lugar de emoji, icones SVG, "Nao" neutro, contraste AA, header com filete, selecionado com brilho, acessibilidade, tela de sucesso unica clara, copy enxuta, "Troca Express"->"Troca". Em producao (reidasjoias.persua.link); parity TransbyShop intacta. ✓ (2026-06-14)
- **Apps Script do Rei das Joias** — web app + planilha, contrato validado por curl, 3 bugs corrigidos (coerção de data, column-type, autorizo). ✓ (2026-06-14)
- **Deploy Dokploy** — merge `feat/multi-tenant`→`main`, motor em produção; reidasjoias.persua.link + pesquisa.transbyshop.com.br servindo correto, ambos `apps_script=ok`. ✓ (2026-06-14)
- Motor multi-tenant (template + config + entrypoint + nginx map + override nível-3). ✓
- Gate de parity da TransbyShop (byte-a-byte). ✓
- Cliente Rei das Joias configurado ("Pêssego & Ouro"). ✓
- Estrutura multiagente (ai-project-structure completa) + docs reais. ✓
