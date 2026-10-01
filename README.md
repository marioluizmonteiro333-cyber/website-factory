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

## Restrições iniciais

- Sem orçamento de investimento ou custos recorrentes obrigatórios.
- Preferência por ferramentas gratuitas, open source e execução local.
- Nesta etapa não criar aplicação, instalar dependências, criar templates, componentes, database, CI/CD ou deploy.

## Documentação

- [Especificação do produto](PRODUCT_SPEC.md)
- [Arquitetura conceptual](ARCHITECTURE.md)
- [Instruções de contribuição e agentes](AGENTS.md)
- [Avaliação e decisões da stack](STACK_EVALUATION.md)

## Estado atual

**Fase 0 — APPROVED**

Decisões aprovadas: stack MVP definida; Git obrigatório e GitHub como repositório principal; Golden Standard obrigatório; quality gates iniciais aprovados; dados iniciais em JSON validados por Zod; database fora da primeira implementação.

## Source of Truth

| Documento/artefacto | Autoridade |
| --- | --- |
| PRODUCT_SPEC.md | Define o que o produto deve fazer. |
| ARCHITECTURE.md | Define princípios e estrutura arquitetural. |
| AGENTS.md | Define regras de trabalho para agentes e IA. |
| STACK_EVALUATION.md | Documenta as decisões e justificações técnicas da stack. |
| Contratos técnicos futuros | Serão a fonte de verdade para interfaces e regras executáveis. |

Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, a implementação deve ser interrompida e a contradição deve ser reportada para revisão.
