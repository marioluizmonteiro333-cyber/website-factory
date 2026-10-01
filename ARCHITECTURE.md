# Arquitetura Conceptual

## 1. Diagnóstico

O risco principal é converter a plataforma numa coleção de websites feitos à medida. A arquitetura deve preservar a cadeia de reutilização e impedir que conteúdo ou exceções de clientes se tornem código duplicado.

## 2. Modelo conceptual aprovado

```text
Design System
  → Componentes
    → Sections (required, optional, conditional)
      → Layouts
        → Templates versionados e aprovados
          → Dados semânticos do cliente
            → Website gerado
```

Este modelo define responsabilidades; não escolhe frameworks, linguagens, bases de dados, serviços ou infraestrutura.

## 3. Contratos estruturais

- Cada camada reutiliza a camada anterior; não deve reproduzir a sua lógica.
- Componentes, sections, layouts e templates devem ter contratos definidos antes da implementação.
- Templates declaram conjuntos de sections required, optional e conditional; categorias e variantes podem usar conjuntos diferentes sem duplicar componentes.
- Sections conditional dependem apenas de condições semânticas e opções aprovadas, nunca de alterações arbitrárias de código durante a geração.
- Templates consomem dados semânticos do cliente, não conteúdo embutido no código nem regras de apresentação acopladas aos dados.
- O modelo de dados deve cobrir business identity, contact, location, opening hours, branding, services/products, gallery, social links e features.
- Personalizações LEVEL 1 e LEVEL 2 são configurações previstas por contratos aprovados. LEVEL 3 é desenvolvimento personalizado e fica fora da geração automática do MVP.

## 4. Governação de templates e padrões

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

- Apenas templates APPROVED ou PRODUCTION podem participar na geração automática; PRODUCTION é a escolha default para novos websites.
- Todo template é versionado e tem estado de aprovação rastreável.
- Uma alteração incompatível exige nova versão ou processo explícito de migração.
- Um novo template deve reutilizar o Design System, componentes e padrões existentes. A criação de um novo padrão deve ser uma decisão arquitetural explícita e documentada.
- Templates não aprovados e opções fora de contrato são inelegíveis para produção.

## 5. Golden Standard

O Golden Standard é a implementação de referência que estabelece o padrão técnico, visual, estrutural e de qualidade para novos componentes, sections, layouts e templates.

Não exige semelhança visual entre templates. Exige equivalência de padrão em arquitetura, organização do código, Design System, acessibilidade, responsividade, SEO, performance, testes, tratamento de erros, documentação e versionamento.

## 6. Decisão técnica aprovada: TypeScript

TypeScript é obrigatório para o core da plataforma, incluindo contratos e automação do core. A decisão não escolhe framework, infraestrutura ou persistência.

## 7. Contratos obrigatórios antes da implementação

| Contrato | Responsabilidade | Deve impedir |
| --- | --- | --- |
| Component Contract | API, estados, acessibilidade e tokens permitidos de um componente. | Props arbitrárias, estilos fora do Design System e comportamento inconsistente. |
| Section Contract | Dados aceites, componentes permitidos, condições e requisitos da section. | Duplicação de sections e acoplamento de conteúdo ao layout. |
| Layout Contract | Zonas, composição e opções aprovadas de organização. | Layouts ad hoc e alteração estrutural por cliente. |
| Template Contract | Sections, variantes, versões, elegibilidade e regras de geração. | Uso de template/variante não aprovado ou incompatível. |
| Theme Contract | Tokens de branding, opções de tipografia, cores e limites de aplicação. | Valores visuais fora das opções aprovadas. |
| Business Data Contract | Semântica, validação e obrigatoriedade dos dados empresariais. | Dados inválidos, ausentes ou ligados à apresentação. |
| Feature Contract | Features disponíveis, pré-condições, dependências e compatibilidade. | Funcionalidades LEVEL 3 e integrações fora do template aprovado. |

## 8. Limites da IA

A IA opera dentro dos contratos aprovados: pode classificar empresas, selecionar templates e componentes aprovados, gerar conteúdo estruturado, preencher dados e sugerir configurações disponíveis.

Não pode inventar arquitetura de produção, criar componentes arbitrários durante a geração, ignorar contratos, utilizar templates não aprovados ou fazer deploy de uma versão que falhou os critérios de qualidade.

## 9. Qualidade como porta de controlo

O fluxo futuro deve bloquear versões que não cumpram build, TypeScript, lint, responsive design, accessibility validation, SEO fundamentals, performance validation, E2E validation e visual validation quando aplicável.

Os gates iniciais aprovados são: build/TypeScript/ESLint com 0 erros; Lighthouse Performance ≥ 90, Accessibility ≥ 95 e SEO ≥ 90 em perfil mobile de produção; 100% dos fluxos E2E críticos aprovados; e 0 regressões visuais não aprovadas. Cada gate resulta em PASS, FAIL ou EXCEPTION; EXCEPTION exige justificação e aprovação explícita. Ferramentas, ambiente, viewports, fluxos, evidências e processo de exceção continuam por definir.

## 10. Restrição de custo

Todas as capacidades essenciais do MVP devem poder funcionar sem serviços pagos obrigatórios. Dependências pagas ou infraestrutura paga não podem ser requisitos do core inicial.

## 11. Source of Truth

| Documento/artefacto | Autoridade |
| --- | --- |
| PRODUCT_SPEC.md | Define o que o produto deve fazer. |
| ARCHITECTURE.md | Define princípios e estrutura arquitetural. |
| AGENTS.md | Define regras de trabalho para agentes e IA. |
| STACK_EVALUATION.md | Documenta as decisões e justificações técnicas da stack. |
| Contratos técnicos futuros | Serão a fonte de verdade para interfaces e regras executáveis. |

Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, a implementação deve ser interrompida e a contradição deve ser reportada para revisão.

## 12. Decisões futuras

- estrutura exata do monorepo;
- database;
- hosting;
- CI/CD;
- ferramenta de IA;
- ferramenta de visual regression;
- estratégia definitiva de deploy.
