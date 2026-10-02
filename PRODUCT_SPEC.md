# Product Spec — Website Factory

## 1. Problema

Criar websites empresariais individualmente reduz consistência, aumenta custo de manutenção e impede escala. O produto deve transformar padrões validados em websites gerados de forma controlada.

## 2. Objetivo do produto

Disponibilizar um processo repetível para transformar dados estruturados e identidade visual de uma empresa num website profissional, validável e pronto para publicação.

## 3. MVP

O MVP deve provar que o sistema gera websites profissionais e replicáveis para, pelo menos, duas categorias: restaurantes e empresas de serviços. As categorias não são implementadas nesta fase.

O MVP inclui geração controlada por templates aprovados, dados estruturados e validação de qualidade. Desenvolvimento personalizado fora dos contratos aprovados não pertence à geração automática do MVP.

### Modelo aprovado: geração de websites independentes

A Website Factory combina templates aprovados, contratos, configuração e dados semânticos da empresa para produzir um website independente como artefacto/build. No MVP, a plataforma não será um único runtime multi-tenant responsável por renderizar todos os clientes através de rotas dinâmicas.

- O fluxo conceptual é: `Generation Request → Contract Validation → Registry Resolution → Dependency Resolution → composition → build → website independente/static output → Build Manifest`.
- Next.js é a engine de rendering/build usada pelo website gerado; não é, por si só, o modelo de produto da Factory.
- O core da Website Factory é a source of truth; cada website gerado é um output derivado.
- Cada website deve poder ser reproduzido com versões fixadas do template, contratos e componentes relevantes e com um registo imutável da configuração e dos dados de entrada usados na geração.
- Clientes diferentes reutilizam o core e não originam forks independentes.
- Alterações ao core não alteram silenciosamente websites já gerados. Uma atualização exige geração explícita de um novo output.
- Deve ser privilegiada a geração estática quando os requisitos do website o permitirem.
- Funcionalidades que exijam runtime/backend ficam fora desta regra e serão tratadas posteriormente.

Cada geração produz, dentro do output, um Build Manifest logicamente imutável e auditável. O manifesto identifica a geração; versão da Factory e commit da Factory quando aplicável; template e versão; theme e versão; features relevantes e versões; versões dos contratos e componentes relevantes; e um hash determinístico dos dados de entrada utilizados. Não duplica o payload completo do cliente. O core não armazena automaticamente um histórico operacional dos dados dos clientes.

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
| **LEVEL 1 — business data configuration** | Dados específicos da instância, incluindo nome, descrição, contactos, morada, horários, imagens e branding, somente nos campos e regras permitidos pelo Business Data Contract. |
| **LEVEL 2 — registry configuration** | Seleção de artefactos reutilizáveis e opções autorizados pelo Registry, incluindo templates, themes, features, sections, layouts e componentes compatíveis. |
| **LEVEL 3 — factory capability change** | Alteração ou expansão da capacidade da Factory, fora dos contratos/opções aprovados; não pode ser introduzida arbitrariamente pela IA nem integrada na geração automática por EXCEPTION. |

Os dados individuais de um cliente são validados pelo Business Data Contract e não precisam constar previamente do Registry. O Registry cataloga artefactos reutilizáveis e metadados, não valores de instância.

### Regra de enforcement

Contract Validation verifica se dados e configuração respeitam estrutura e valores definidos pelos contratos. Registry Validation verifica se artefactos referenciados existem, têm identidade e versão explícitas, são elegíveis e têm dependências resolvidas. Nas fronteiras contratuais, propriedades, opções ou valores estruturais desconhecidos/não autorizados devem ser rejeitados explicitamente, sem inferência ou descarte silencioso que produza uma geração aparentemente válida. A validação estrita aplica-se às fronteiras adequadas, não indiscriminadamente a todos os objetos internos.

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

Toda versão candidata a geração ou publicação deve cumprir os gates aplicáveis à sua fase:

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

Templates e artefactos reutilizáveis registados seguem este ciclo de vida:

```text
DRAFT → DEVELOPMENT → TESTING → APPROVED → PRODUCTION → DEPRECATED → ARCHIVED
```

| Estado | Definição |
| --- | --- |
| DRAFT | Conceito ou artefacto ainda não implementado. |
| DEVELOPMENT | Em implementação. |
| TESTING | Implementação concluída, em validação. |
| APPROVED | Passou os critérios obrigatórios aplicáveis e está autorizado para utilização. |
| PRODUCTION | Versão aprovada atualmente recomendada/default para novas gerações. |
| DEPRECATED | Não pode ser utilizado em novos artefactos ou novas versões; consumidores aprovados/production existentes podem continuar a usar a dependência já fixada. |
| ARCHIVED | Retirado e inelegível para geração. |

O Registry cataloga Components, Sections, Layouts, Templates, Themes e Features — não os artefactos em si nem os dados específicos de clientes. Cada referência a dependência identifica identidade e versão explicitamente. Somente entradas em **APPROVED** ou **PRODUCTION** podem ser escolhidas para novos artefactos e novas versões; **PRODUCTION** é a recomendação para novas gerações e não implica um runtime partilhado. Todos os artefactos registados são versionados.

Marcar uma dependência como **DEPRECATED** não invalida retroativamente uma versão de consumidor aprovada/production que já a fixa; não ocorre cascata automática de invalidação e esse consumidor pode continuar a usá-la. Uma nova versão do consumidor deve atualizar a dependência quando necessário. Alterações ao core não atualizam websites existentes silenciosamente: requerem geração explícita de novo output.

O Registry físico da FOUNDATION será JSON canónico versionado pelo Git em `src/registry/registry.json`, validado pelo schema Zod em `src/registry/schema.ts`. Conterá metadados de catálogo e resolução — identidade, tipo, versão, estado, dependências versionadas e elegibilidade — sem Business Data. Esta é uma decisão documental; os ficheiros não são criados nesta atualização.

## 10. Golden Standard

O Golden Standard é a implementação de referência que estabelece o padrão técnico, visual, estrutural e de qualidade que todos os novos componentes, sections, layouts e templates devem seguir.

Um novo template não precisa ser visualmente semelhante ao Golden Standard, mas deve obedecer aos mesmos padrões técnicos e de qualidade. O Golden Standard é a referência para arquitetura, organização do código, Design System, acessibilidade, responsividade, SEO, performance, testes, tratamento de erros, documentação e versionamento.

O Theme Contract é a fonte de verdade dos tokens visuais e permanece desacoplado do framework CSS. O fluxo é `Theme Contract → tokens validados → CSS Custom Properties → Tailwind/componentes`; CSS Custom Properties são a ponte canónica para a camada visual. Tailwind consome os tokens e não é a fonte de verdade do Design System.

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

Cada gate avaliado na fase deve produzir **PASS**, **FAIL** ou **EXCEPTION**. **NOT_APPLICABLE** indica que o requisito continua pertencendo ao produto, mas não é critério de conclusão dessa fase; não substitui PASS. EXCEPTION exige justificação e aprovação explícita conforme as regras desta secção e só pode ser usada para um gate aplicável não cumprido. Ferramentas, ambiente, viewports, fluxos e evidências permanecem decisões futuras.

Os gates são phase-scoped. Na FOUNDATION, typecheck, lint, unit tests, E2E e build são aplicáveis e devem passar. A ausência de testes não pode ser considerada sucesso: as flags `--passWithNoTests` e `--pass-with-no-tests` não podem permanecer nos comandos oficiais ao encerrar a FOUNDATION. Lighthouse e Visual Regression são **NOT_APPLICABLE** nesta fase: continuam requisitos do produto, mas não critérios de conclusão; NOT_APPLICABLE não equivale a PASS. Quando aplicáveis em fases posteriores, os thresholds são Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90 e Visual Regression = 0 regressões não aprovadas. EXCEPTION só se aplica a gate já aplicável, não cumprido e formalmente aprovado.

### Aprovação e exceções

- O **Product Owner** aprova decisões de produto e exceções de produto. O **Engineering Reviewer** aprova decisões técnicas e exceções técnicas. No estágio atual, a mesma pessoa pode exercer ambos os papéis; a aprovação deve identificar o papel exercido.
- Aprovações e exceções devem ser rastreáveis no histórico de revisão do repositório, identificando a decisão, o âmbito/versão e o papel aprovador; não é necessário criar um sistema ou documento de aprovação separado.
- Uma versão só pode passar a **APPROVED** após cumprir os critérios obrigatórios e receber as aprovações de produto e técnica aplicáveis ao seu âmbito. **PRODUCTION** é a versão aprovada recomendada para novas gerações.
- Uma EXCEPTION é específica ao artefacto/versão e à regra ou gate em causa. Deve registar justificação, impacto, mitigação quando aplicável, papel e aprovador, data e prazo ou condição de encerramento. A aprovação cabe ao papel responsável pela regra; se afetar produto e técnica, ambos devem aprovar.
- EXCEPTION não altera o estado global nem a elegibilidade do artefacto, não aprova opções fora do contrato e nunca permite geração LEVEL 3.

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
| 1 — FOUNDATION | Fundação técnica e primeiro padrão validável, com artefactos verificáveis que sirvam de base à replicação posterior. |
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

## 17. Entrada na Fase 1

A Fase 1 — FOUNDATION — tem o seguinte escopo aprovado.

### Inclui

1. Fundação técnica com Next.js, React, TypeScript, Tailwind CSS, ESLint, Prettier, Vitest e Playwright, segundo as decisões aprovadas em STACK_EVALUATION.md.
2. Estrutura inicial replicável do projeto, adequada à reutilização sem antecipar uma arquitetura de monorepo ou serviços não aprovados.
3. Base contratual dos sete contratos canónicos: Component, Section, Layout, Template, Theme, Business Data e Feature. Inclui o primeiro baseline executável de Business Data, Theme, Feature e Template. A implementação e validação dos sete podem ter profundidades diferentes conforme o que o Golden Standard v0.1 efetivamente exercita; os quatro contratos centrais não excluem os outros três.
4. Primeiro registry físico, versionado no repositório, que registe os artefactos e estados elegíveis segundo ARCHITECTURE.md.
5. Design System v0.1.
6. Golden Standard v0.1 como primeiro padrão de referência, verificável face aos contratos centrais e ao Design System.
7. Quality baseline executável de typecheck, lint, unit tests, E2E e build. Todos devem passar para a versão candidata; ausência de testes não pode ser tratada como sucesso. O E2E valida o output servido após o build final/produção e inclui um perfil mobile representativo. Lighthouse e Visual Regression são NOT_APPLICABLE na FOUNDATION, não PASS.

Os artefactos produzidos devem ser verificáveis e demonstrar que um padrão pode ser reproduzido a partir dos contratos, do registry e do Design System, sem exigir a implementação de múltiplos templates.

### Não inclui

- múltiplos templates;
- geração automática por IA;
- scraping;
- leads ou CRM;
- automação comercial;
- database;
- hosting de produção;
- pagamentos;
- sistema de clientes.

Estas exclusões não alteram decisões de fases futuras nem autorizam substitutos ou infraestrutura fora do escopo.

### Critérios objetivos de conclusão da Fase 1

1. A fundação técnica usa apenas a stack aprovada, com as ferramentas listadas acima configuradas e executáveis localmente.
2. Existe uma estrutura inicial replicável documentada e demonstrada pelos artefactos de referência.
3. A base contratual dos sete contratos canónicos está definida e existe baseline executável de Business Data, Theme, Feature e Template; a implementação e os testes cobrem os contratos exercitados pelo Golden Standard v0.1.
4. Existe um registry físico versionado no repositório, e os artefactos de referência estão identificados e têm estados coerentes com a sua elegibilidade.
5. Design System v0.1 e Golden Standard v0.1 estão documentados/implementados como artefactos verificáveis, com o Golden Standard a demonstrar a composição aprovada dos contratos.
6. Typecheck, lint, unit tests, E2E no output de build final (incluindo perfil mobile) e build passam; ausência de testes não é sucesso. Qualquer falha num gate aplicável bloqueia a conclusão, exceto quando uma EXCEPTION específica for formalmente aprovada segundo as regras desta especificação. Lighthouse e Visual Regression mantêm estado NOT_APPLICABLE nesta fase.
7. Não foi introduzido nenhum item da lista “Não inclui”.

Todos os critérios de conclusão são obrigatórios. A Fase 1 produz artefactos verificáveis e não implica, por si só, geração automática por IA, múltiplos templates, database, hosting de produção ou sistemas operacionais futuros.
