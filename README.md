# Website Factory

## Objetivo

Construir uma plataforma replicável para gerar websites profissionais de empresas a partir de padrões previamente validados: design system, componentes, sections, layouts, templates e dados estruturados do cliente.

O produto deve permitir, progressivamente, selecionar um template, aplicar identidade e conteúdo, gerar um website, validar a qualidade e fazer deploy. Aquisição de leads, análise de websites, prospeção e venda pertencem a fases futuras.

## Princípios

- Reutilização acima de construção manual por cliente.
- Conteúdo separado da apresentação.
- Templates orientados por dados, versionados e aprovados antes de produção.
- Qualidade, testabilidade e replicabilidade acima da velocidade inicial.
- IA limitada a regras, estruturas e padrões aprovados.
- Simplicidade arquitetural até existir uma necessidade comprovada.

## Restrições por fase

- Sem orçamento de investimento ou custos recorrentes obrigatórios.
- Preferência por ferramentas gratuitas, open source e execução local.
- Na Fase 0, não criar aplicação, instalar dependências, criar templates, componentes, database, CI/CD ou deploy.
- Na Fase 1 — FOUNDATION, implementar apenas o escopo aprovado abaixo e detalhado na PRODUCT_SPEC.md e ARCHITECTURE.md; não antecipar as funcionalidades excluídas dessa fase.

## Documentação

- [Especificação do produto](PRODUCT_SPEC.md)
- [Arquitetura conceptual](ARCHITECTURE.md)
- [Instruções de contribuição e agentes](AGENTS.md)
- [Avaliação e decisões da stack](STACK_EVALUATION.md)

## Estado atual

**Fase 0 — APPROVED / concluída**

Baselines aprovados: sete contratos canónicos e regras documentais do Registry; distinção entre Registry de artefactos reutilizáveis e Business Data por instância; aprovação e exceções por Product Owner e Engineering Reviewer (a mesma pessoa pode exercer ambos os papéis nesta fase); enforcement de LEVEL 1/2/3, sem introdução arbitrária de capacidade LEVEL 3 pela IA; geração de websites independentes e Build Manifest; escopo aprovado da Fase 1 — FOUNDATION. Decisões técnicas aprovadas: stack MVP; Git obrigatório e GitHub como repositório principal; Golden Standard obrigatório; quality gates por fase; dados iniciais em JSON validados por Zod; database fora da primeira implementação.

A Fase 1 — FOUNDATION — é a fundação técnica + primeiro padrão validável. O seu escopo, entregáveis, exclusões e critérios de conclusão estão definidos na secção 14 de ARCHITECTURE.md e na secção 17 de PRODUCT_SPEC.md. A Fase 0 está fechada; a implementação desses entregáveis pertence à Fase 1 e não foi antecipada pelo seu fecho.

## Source of Truth

| Documento/artefacto | Autoridade |
| --- | --- |
| PRODUCT_SPEC.md | Define o que o produto deve fazer. |
| ARCHITECTURE.md | Define princípios e estrutura arquitetural. |
| AGENTS.md | Define regras de trabalho para agentes e IA. |
| STACK_EVALUATION.md | Documenta as decisões e justificações técnicas da stack. |
| Contratos técnicos futuros | Serão a fonte de verdade para interfaces e regras executáveis. |

Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, a implementação deve ser interrompida e a contradição deve ser reportada para revisão.
