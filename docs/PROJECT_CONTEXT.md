# PROJECT_CONTEXT

**Nome do projeto:** Plataforma CSAT Multi-Tenant (pesquisa-satisfacao)

## Objetivo Do Projeto

Servir um formulário de pesquisa de satisfação (CSAT) white-label para múltiplos clientes a partir de um único motor (nginx + shell), com domínio, marca e backend de dados próprios por cliente. Começou single-tenant para a TransbyShop (em produção) e foi generalizado para multi-tenant **sem alterar a TransbyShop**.

## Publico Ou Usuario Final

- **Operador da plataforma** (dono do projeto): vende e onboarda clientes, configura domínios e endpoints.
- **Clientes** (lojas/empresas — varejo, joalheria, etc.): recebem o formulário na própria marca e domínio.
- **Cliente final**: responde a pesquisa no celular, via link com parâmetros.

## Estado Atual

- Motor multi-tenant **pronto e validado**: TransbyShop renderiza byte-a-byte idêntico ao HTML original (gate de parity); Rei das Joias renderizado e verificado.
- 2 clientes: `transbyshop` (produção) e `reidasjoias` (`reidasjoias.persua.link`, design "Pêssego & Ouro").
- **Pendente**: deploy no Dokploy (env vars + domínios); Apps Script do Rei das Joias; refino de design por cliente (fase seguinte).

## Preferencias

- Idioma padrão: português.
- Instruções de IA centralizadas em `AGENTS.md`.
- Stack mínima: HTML estático + nginx + shell. **Sem Node/build.**

## Fora De Escopo

Sem confirmação explícita do usuário, **não**:
- alterar o design/HTML da TransbyShop (produção);
- mexer em dados/planilhas de clientes;
- commitar segredos (Apps Script URLs ficam em env var, nunca no repo).

## Restricoes

- **Gate obrigatório**: qualquer mudança no motor deve manter a TransbyShop byte-idêntica (ver `QUALITY.md`).
- Segredos por cliente via env `APPS_SCRIPT_URL_<SLUG>` (Dokploy), fora do repositório.
- `envsubst` só pode tocar os tokens da lista explícita — nunca os template literals do JS (`${nome}`, `${APPS_SCRIPT_URL}`, `${encodeURIComponent(...)}`).

## Links Internos

- Regras de IA: `../AGENTS.md`
- Arquitetura: `ARCHITECTURE.md`
- Onboarding de cliente: `ONBOARDING.md`
- Tarefas: `TASKS.md`
- Decisões: `DECISIONS.md`
- Qualidade / gate: `QUALITY.md`
