# CHANGELOG

Historico de mudancas relevantes.

## 2026-06-14 — Redesign individual do Rei das Joias (override Nivel 3)

- Novo `clientes/reidasjoias/index.html` (design proprio, isolado do template; parity TransbyShop intacta byte-a-byte).
- Nota com carinhas em linha (SVG) no lugar de emoji; chips/recompra com icones SVG; "Nao" neutro; contraste AA; header com filete de ouro; selecionado com gradiente+brilho; acessibilidade (inputs reais, foco, aria).
- Tela de sucesso unica e clara "Sua opiniao foi registrada!" (creme+ouro); sem roteamento Google/WhatsApp; copy enxuta.
- "Troca Express" -> "Troca". Deploy em producao (reidasjoias.persua.link).
- Refino visual: nota selecionada colorida por sentimento (1 vermelho → 5 verde, neutro dourado, via `:has()` com fallback ouro); chip/recompra selecionado unificado ao ouro do botao (#C6A15B) com texto escuro.
- Captura do param `vendedor` no link (hidden field + leitura URL); requer coluna 11 no Sheet + `vendedor` nos HEADERS do Apps Script (v8).
- Carregamento: checagem "já respondeu" movida para ANTES de exibir o form (spinner ~2,5s, 1 tentativa, fail-open) — o form nunca mais e trocado pela tela "registrada" no meio do preenchimento.

## 2026-06-30 — Apps Script do rei v9 (referência versionada)

- Adiciona `clientes/reidasjoias/apps-script.gs` (referência; deploy é manual no editor do Google).
- v9 grava por NOME de coluna (header-mapped) — `vendedor` em qualquer posição funciona; v7/v8 gravavam por índice fixo e deslocavam ao inserir coluna no meio.
- Corrige nos docs: aba real = `PesquisaSatisfação` (não `Respostas`); pegadinha do deploy (`/exec` serve a versão implantada, exige "Nova versão" na implantação existente).
