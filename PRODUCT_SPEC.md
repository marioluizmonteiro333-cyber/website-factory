# Product Spec — Website Factory

## 1. Problema

Criar websites empresariais individualmente reduz consistência, aumenta custo de manutenção e impede escala. O produto deve transformar padrões validados em websites gerados de forma controlada.

## 2. Objetivo do produto

Disponibilizar um processo repetível para transformar dados estruturados e identidade visual de uma empresa num website profissional, validável e pronto para publicação.

## 3. MVP

O MVP deve provar que o sistema gera websites profissionais e replicáveis para, pelo menos, duas categorias: restaurantes e empresas de serviços. As categorias não são implementadas nesta fase.

O MVP inclui geração controlada por templates aprovados, dados estruturados e validação de qualidade. Desenvolvimento personalizado fora dos contratos aprovados não pertence à geração automática do MVP.

## 4. Estrutura do website

Uma section é uma unidade reutilizável de composição de conteúdo num website. Um template define quais sections pode utilizar e como as organiza, sem duplicar os componentes que as compõem.

- **REQUIRED sections:** obrigatórias para uma categoria, template ou variante; têm de estar presentes para a geração ser válida.
- **OPTIONAL sections:** disponíveis para seleção dentro das opções aprovadas do template ou variante; podem ser incluídas ou omitidas sem invalidar a geração.
- **CONDITIONAL sections:** incluídas apenas quando uma condição semântica definida é satisfeita, por exemplo a existência de dados ou de uma feature aprovada.

Categorias podem utilizar conjuntos distintos de sections. A variação deve ser expressa por configuração e contratos de template, preservando o reuso de componentes e sections existentes.

## 5. Dados semânticos

Os dados de cada empresa devem ser semânticos e separados da apresentação. O modelo conceptual deve suportar, no mínimo:

- business identity;
- contact;
- location;
- opening hours;
- branding;
- services/products;
- gallery;
- social links;
- features.

O modelo define o significado da informação, não a sua representação visual. O primeiro protótipo pode utilizar ficheiros JSON validados por Zod. Database não integra a primeira implementação e permanece uma decisão futura.

## 6. Personalização

| Nível | Âmbito |
| --- | --- |
| **LEVEL 1 — automatic configuration** | Logo, cores, tipografia dentro das opções aprovadas, imagens, conteúdo, contactos e horários. |
| **LEVEL 2 — controlled configuration** | Template, variante de template, sections opcionais, opções de layout aprovadas e variantes aprovadas de CTA/navegação. |
| **LEVEL 3 — custom development** | Nova funcionalidade, integrações externas, autenticação, dashboards, lógica de negócio complexa e qualquer elemento fora dos contratos aprovados. |

LEVEL 3 não integra a geração automática do MVP. LEVEL 1 e LEVEL 2 só podem usar opções e contratos aprovados.

## 7. IA

A IA pode:

- classificar empresas;
- selecionar templates existentes;
- selecionar componentes aprovados;
- gerar conteúdo estruturado;
- preencher dados;
- sugerir configurações dentro das opções disponíveis.

A IA não pode:

- inventar arquitetura de produção;
- criar componentes arbitrários durante a geração;
- ignorar contratos;
- utilizar templates não aprovados;
- fazer deploy de uma versão que falhou nos critérios de qualidade.

## 8. Qualidade mínima

Toda versão candidata a geração ou publicação deve cumprir:

- build sem erros;
- TypeScript sem erros;
- lint sem erros;
- responsive design;
- accessibility validation;
- SEO fundamentals;
- performance validation;
- E2E validation;
- visual validation, quando aplicável.

Os quality gates aprovados estão documentados na secção 12.

## 9. Templates

O ciclo de vida de um template é:

```text
DRAFT → DEVELOPMENT → TESTING → APPROVED → PRODUCTION → DEPRECATED → ARCHIVED
```

| Estado | Definição |
| --- | --- |
| DRAFT | Conceito ou template ainda não implementado. |
| DEVELOPMENT | Em implementação. |
| TESTING | Implementação concluída, em validação. |
| APPROVED | Passou todos os critérios obrigatórios e está autorizado para utilização. |
| PRODUCTION | Versão atualmente recomendada/default para novas gerações. |
| DEPRECATED | Mantido para compatibilidade, mas inelegível para novos websites. |
| ARCHIVED | Retirado e inelegível para geração. |

Somente templates em **APPROVED** ou **PRODUCTION** podem ser utilizados na geração automática. **PRODUCTION** é o estado recomendado para novos websites. Templates devem ser versionados. Uma alteração incompatível deve criar uma nova versão ou passar por um processo explícito de migração.

## 10. Golden Standard

O Golden Standard é a implementação de referência que estabelece o padrão técnico, visual, estrutural e de qualidade que todos os novos componentes, sections, layouts e templates devem seguir.

Um novo template não precisa ser visualmente semelhante ao Golden Standard, mas deve obedecer aos mesmos padrões técnicos e de qualidade. O Golden Standard é a referência para arquitetura, organização do código, Design System, acessibilidade, responsividade, SEO, performance, testes, tratamento de erros, documentação e versionamento.

## 11. Decisão técnica aprovada: TypeScript

TypeScript é obrigatório para o core da plataforma. Esta decisão aplica-se a código de produção, contratos e automação do core; não escolhe framework, motor de persistência ou infraestrutura.

## 12. Quality gates aprovados

| Área | Threshold inicial aprovado |
| --- | --- |
| Build, TypeScript e lint | 0 erros. |
| Performance | Lighthouse Performance ≥ 90 em perfil mobile de produção. |
| Accessibility | Lighthouse Accessibility ≥ 95 e 0 violações críticas/blocking na validação adotada. |
| SEO | Lighthouse SEO ≥ 90 e metadados fundamentais válidos. |
| E2E | 100% dos fluxos críticos aprovados nos navegadores acordados. |
| Visual regression | 0 regressões não aprovadas. |

Cada gate deve produzir um dos estados **PASS**, **FAIL** ou **EXCEPTION**. EXCEPTION exige justificação e aprovação explícita. Ferramentas, ambiente, viewports, fluxos, evidências e processo de exceção permanecem decisões futuras.

## 13. Replicação e custo

Um novo template deve reutilizar o Design System, componentes e padrões existentes. A criação de um novo padrão deve ser uma decisão arquitetural explícita e documentada.

Todas as capacidades essenciais do MVP devem poder funcionar sem serviços pagos obrigatórios. Dependências pagas ou infraestrutura paga não podem ser requisitos do core inicial.

## 14. Source of Truth

| Documento/artefacto | Autoridade |
| --- | --- |
| PRODUCT_SPEC.md | Define o que o produto deve fazer. |
| ARCHITECTURE.md | Define princípios e estrutura arquitetural. |
| AGENTS.md | Define regras de trabalho para agentes e IA. |
| STACK_EVALUATION.md | Documenta as decisões e justificações técnicas da stack. |
| Contratos técnicos futuros | Serão a fonte de verdade para interfaces e regras executáveis. |

Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, a implementação deve ser interrompida e a contradição deve ser reportada para revisão.

## 15. Fases previstas

| Fase | Resultado esperado |
| --- | --- |
| 0 — Fundação | Decisões, critérios de aprovação e regras de governação definidos. |
| 1 — Base validável | Primeiro fluxo mínimo e padrões reutilizáveis aprovados. |
| 2 — Geração controlada | Geração por template e dados estruturados, com validações definidas. |
| 3 — Publicação | Processo de deploy definido e verificável. |
| 4 — Operação e escala | Gestão de templates, versões, qualidade e replicação. |
| 5 — Crescimento automatizado | Funcionalidades de leads, análise, prospeção e venda, se aprovadas. |

## 16. Decisões futuras

- estrutura exata do monorepo;
- database;
- hosting;
- CI/CD;
- ferramenta de IA;
- ferramenta de visual regression;
- estratégia definitiva de deploy.
