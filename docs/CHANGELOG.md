# CHANGELOG

Historico de mudancas relevantes.

## 2026-06-14 — Redesign individual do Rei das Joias (override Nivel 3)

- Novo `clientes/reidasjoias/index.html` (design proprio, isolado do template; parity TransbyShop intacta byte-a-byte).
- Nota com carinhas em linha (SVG) no lugar de emoji; chips/recompra com icones SVG; "Nao" neutro; contraste AA; header com filete de ouro; selecionado com gradiente+brilho; acessibilidade (inputs reais, foco, aria).
- Tela de sucesso unica e clara "Sua opiniao foi registrada!" (creme+ouro); sem roteamento Google/WhatsApp; copy enxuta.
- "Troca Express" -> "Troca". Deploy em producao (reidasjoias.persua.link).
- Refino visual: nota selecionada colorida por sentimento (1 vermelho → 5 verde, neutro dourado, via `:has()` com fallback ouro); chip/recompra selecionado unificado ao ouro do botao (#C6A15B) com texto escuro.
