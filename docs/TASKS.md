# TASKS

## Em Andamento

- Nenhuma.

## Proximas Tarefas

- **Outage TransbyShop (verificar perda):** entre ~14:11–14:17 de 2026-06-14 o deploy multi-tenant ficou com env `SEM URL` e o form não enviava; houve carga real (codcliente `0000020466`, 14:12). Conferir a planilha e recontatar se faltar resposta.
- **Apps Script — limpeza:** remover linhas `TESTE*` da planilha do rei; remover probes `?ping`/`?headers` do `Code.gs` (v6) se quiser produção limpa.
- **Dedup TransbyShop em produção:** verificar se a planilha sofre da mesma coerção de data que quebrava o "já respondeu" — sem alterar o motor (invariante de parity).
- **Deploy Apps Script v10 (rei):** colar o v10 no editor + "Nova versao"; confirmar `?ping=1 -> {pong:'v10'}` + teste de duplo-envio (dedup server-side, 2o POST = `duplicate:true` sem subir linha). Codigo em `clientes/reidasjoias/apps-script.gs`.
- **Dokploy build error (`parent snapshot ... does not exist`):** cache de build corrompido no host; Redeploy (transitorio) ou `docker builder prune -af` / `docker system prune -af` / restart docker. Bloqueia subir mudancas de PAGINA ate limpar.
- **Limpeza planilha rei:** apagar linhas de teste (TESTE0001, EDILON desalinhada do v7, CLAUDETEST1).
- **Domínio TransbyShop:** `pesquisa.transbyshop.com.br` confirmado; serve pelo `default` do map (funciona). Rota explícita é opcional.
- **Alerta interno de detrator (opcional, #6):** Apps Script dispara aviso ao gestor quando nota<=3 (nome/telefone/motivos). Parkado: o cliente optou por tela de sucesso unica, sem roteamento publico Google/WhatsApp; este aviso e server-side e independe da tela.

## Ideias / Roadmap

- **Nível 2 — perguntas por cliente:** slot `@QUESTIONS@` no template + `clientes/<slug>/perguntas.html` (hoje perguntas inline compartilhadas).
- **Token `--primary-ink`** (cor de texto escura derivada) p/ rigor AA em badges/labels quando `PRIMARY` é tom médio (ex: ouro).
- Página 404 por tenant.
- **UX incognito do dedup:** pagina ler flag `duplicate` do POST (mostrar "ja respondeu" apos envio) [precisa Dokploy]; ou ping agendado no n8n mantendo o Apps Script quente (mata o cold-start ~7,6s).

## Concluidas

- **Campo `vendedor` + Apps Script v9/v10 (rei)** — pagina captura `vendedor` (hidden + URL); Apps Script reescrito p/ gravar por NOME de coluna (v9, independe da ordem) + dedup server-side no `doPost` (v10, nao grava duplicado + LockService). Aba real = `Respostas`. Referencia em `clientes/reidasjoias/apps-script.gs`. ✓ codigo (2026-06-30) — *deploy v10 no editor ainda pendente*
- **Geracao do link (n8n/Shlink)** — orientado: API Shlink em `persua.link` (nao no subdominio do form); muda so o `longUrl` por cliente. ✓ (2026-06-30)
- **Redesign individual do Rei das Joias** — override Nivel 3 (`clientes/reidasjoias/index.html`): carinhas no lugar de emoji, icones SVG, "Nao" neutro, contraste AA, header com filete, selecionado com brilho + cor por sentimento, acessibilidade, tela de sucesso unica clara, copy enxuta, "Troca Express"->"Troca". Em producao (reidasjoias.persua.link); parity TransbyShop intacta. ✓ (2026-06-30)
- **Apps Script do Rei das Joias** — web app + planilha, contrato validado por curl, 3 bugs corrigidos (coerção de data, column-type, autorizo). ✓ (2026-06-14)
- **Deploy Dokploy** — merge `feat/multi-tenant`→`main`, motor em produção; reidasjoias.persua.link + pesquisa.transbyshop.com.br servindo correto, ambos `apps_script=ok`. ✓ (2026-06-14)
- Motor multi-tenant (template + config + entrypoint + nginx map + override nível-3). ✓
- Gate de parity da TransbyShop (byte-a-byte). ✓
- Cliente Rei das Joias configurado ("Pêssego & Ouro"). ✓
- Estrutura multiagente (ai-project-structure completa) + docs reais. ✓
