# Avaliação Técnica da Stack — Proposta Fase 0

## Critérios

Avaliação baseada em custo obrigatório, licença, execução local, maturidade, integração, manutenção, replicação e risco. Sem instalação ou decisão automática.

| Tecnologia | Custo/licença | Local, maturidade e integração | Adequação, replicação e riscos | Parecer |
| --- | --- | --- | --- | --- |
| Next.js | Sem custo obrigatório; MIT. | Execução local e self-hosting suportados; framework React maduro. Integra React, TypeScript, ESLint e Playwright. | Bom para websites com SEO e geração estática; reduz decisões de integração. Risco: funcionalidades dinâmicas elevam exigências de hosting. | Aprovado para MVP, inicialmente com escopo estático. |
| React | Sem custo obrigatório; MIT. | Local e muito maduro; fundação do Next.js. | Excelente para componentes reutilizáveis. Sozinho exige decidir build, rotas, SEO e convenções. | Aprovado através do Next.js, não como stack paralela. |
| Tailwind CSS | Sem custo obrigatório; MIT. | Compilação local, zero runtime; maduro e integrado com React/Next. | Tokens e utilitários facilitam consistência. Risco: classes dispersas se o Design System não abstrair componentes. | Aprovado, condicionado a Theme/Component Contract. |
| Zod | Sem custo obrigatório; MIT. | Local, TypeScript-first, sem dependências externas. | Mantém contratos de dados executáveis e reutilizáveis. Risco: schemas duplicados ou transformações excessivas. | Aprovado para contratos. |
| Vitest | Sem custo obrigatório; MIT. | Local, maduro; integração natural com TypeScript e ecossistema Vite. | Rápido para contratos e lógica pura. Risco: exige configuração própria fora de Vite/Next e não substitui E2E. | Aprovado para testes unitários/contratos. |
| Playwright | Sem custo obrigatório; Apache-2.0. | Local/CI, multi-browser e emulação mobile. | Forte para E2E, responsive e evidências. Risco: downloads de browsers e tempo de execução. | Aprovado para fluxos críticos; cobertura inicial limitada. |
| ESLint | Sem custo obrigatório; MIT. | Local, maduro, configurável e integrado com TypeScript/Next. | Evita padrões inseguros e inconsistentes. Risco: regras excessivas criam ruído. | Aprovado com regras mínimas aprovadas. |
| Prettier | Sem custo obrigatório; MIT. | Local, maduro e complementar ao ESLint. | Reduz diffs e custo de revisão. Risco: alterações de versão mudam formatação. | Aprovado com versão fixada. |
| Git/GitHub | Git sem custo obrigatório; GPL-2.0. GitHub é o repositório principal e não introduz custo obrigatório no core. | Git é local e maduro; GitHub centraliza colaboração remota e histórico. | Git viabiliza versionamento, revisão e rastreabilidade; recursos pagos do GitHub não podem tornar-se requisitos do core. | Git e GitHub aprovados. |

## Stack aprovada para o MVP

- Next.js + React + TypeScript para a aplicação e geração de websites.
- Tailwind CSS para implementação dos tokens e estilos do Design System.
- Zod para contratos de dados e validação em runtime.
- Vitest para unitários e contratos; Playwright para E2E crítico, responsive e evidência visual.
- ESLint + Prettier para qualidade estática e consistência.
- Git obrigatório e GitHub como repositório principal.

Esta composição está aprovada para o MVP, funciona localmente e não requer serviço pago. Não adiciona outras tecnologias. Hosting, CI/CD, database, ferramenta de IA, visual regression e deploy continuam sem decisão.

## Source of Truth

| Documento/artefacto | Autoridade |
| --- | --- |
| PRODUCT_SPEC.md | Define o que o produto deve fazer. |
| ARCHITECTURE.md | Define princípios e estrutura arquitetural. |
| AGENTS.md | Define regras de trabalho para agentes e IA. |
| STACK_EVALUATION.md | Documenta as decisões e justificações técnicas da stack. |
| Contratos técnicos futuros | Serão a fonte de verdade para interfaces e regras executáveis. |

Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, a implementação deve ser interrompida e a contradição deve ser reportada para revisão.

## Fontes

- [Next.js: documentação e self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [React: instalação](https://react.dev/learn/installation)
- [Tailwind CSS: CLI](https://tailwindcss.com/docs/installation/tailwind-cli)
- [Zod: introdução](https://zod.dev/)
- [Vitest: guia](https://vitest.dev/guide/)
- [Playwright: instalação](https://playwright.dev/docs/intro)
- [ESLint: documentação](https://eslint.org/docs/latest/)
- [Prettier: instalação](https://prettier.io/docs/install.html)
