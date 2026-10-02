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

### Modelo de geração aprovado: websites independentes

A Website Factory funciona como um motor de geração. Combina templates aprovados, contratos, configuração e dados semânticos da empresa para produzir um website independente como artefacto/build. O MVP não é um único runtime multi-tenant que renderiza todos os clientes por rotas dinâmicas.

- O fluxo conceptual é: `Generation Request → validação de contratos → resolução do Registry → resolução de dependências → composição → build → website independente/static output → Build Manifest`.
- Next.js é uma engine de rendering/build utilizada pelo website gerado; não define o modelo de produto da Website Factory.
- O core da Website Factory é a source of truth; os websites gerados são outputs derivados do core.
- Cada output deve ser reproduzível com versões fixadas do template, contratos e componentes relevantes, e com um registo imutável da configuração e dos dados de entrada usados na geração.
- Websites de clientes diferentes reutilizam o core; não criam forks independentes do core.
- Uma alteração ao core não modifica silenciosamente websites já gerados. Atualizar um output exige uma nova geração explícita e validação do novo artefacto.
- O MVP privilegia geração estática quando os requisitos do website o permitirem.
- Funcionalidades que exijam runtime ou backend ficam fora desta regra e serão tratadas posteriormente, sem presumir arquitetura ou infraestrutura nesta fase.

#### Build Manifest

Cada geração produz, dentro do output, um Build Manifest logicamente imutável e auditável. Deve identificar a geração; versão da Factory e commit da Factory quando aplicável; template e versão; theme e versão; features relevantes e versões; versões dos contratos relevantes; componentes relevantes e versões; e um hash determinístico dos dados de entrada utilizados. O payload completo do cliente não é duplicado no manifesto. O core não mantém automaticamente um histórico operacional dos dados dos clientes.

## 3. Contratos estruturais

- Cada camada reutiliza a camada anterior; não deve reproduzir a sua lógica.
- Componentes, sections, layouts e templates devem ter contratos definidos antes da implementação.
- Os sete contratos canónicos são Component, Section, Layout, Template, Theme, Business Data e Feature. A FOUNDATION estabelece a base contratual dos sete; a implementação e validação podem ter profundidades diferentes conforme o que for exercitado pelo Golden Standard v0.1.
- Os contratos de artefactos reutilizáveis identificam, no mínimo, `id` estável, tipo, versão, estado, compatibilidade, finalidade, opções permitidas, invariantes e elegibilidade. O Business Data Contract define campos e regras para dados específicos de uma instância, não uma entrada de Registry por cada valor de cliente.
- Templates declaram conjuntos de sections required, optional e conditional; categorias e variantes podem usar conjuntos diferentes sem duplicar componentes.
- Sections conditional dependem apenas de condições semânticas e opções aprovadas, nunca de alterações arbitrárias de código durante a geração.
- Templates consomem dados semânticos do cliente, não conteúdo embutido no código nem regras de apresentação acopladas aos dados.
- O modelo de dados deve cobrir business identity, contact, location, opening hours, branding, services/products, gallery, social links e features.
- LEVEL 1 personaliza dados da instância somente dentro dos campos e regras permitidos pelo Business Data Contract. LEVEL 2 seleciona artefactos reutilizáveis e opções autorizados pelo Registry. LEVEL 3 altera ou expande capacidades da Factory e não pode ser introduzido arbitrariamente pela IA.
- Nas fronteiras contratuais, entradas devem rejeitar explicitamente propriedades, opções e valores estruturais desconhecidos ou não autorizados, sem inferência ou descarte silencioso que produza uma geração aparentemente válida. Esta regra comportamental aplica-se às fronteiras adequadas; não exige modo estrito indiscriminado em todos os objetos internos.
- Contract Validation verifica que a estrutura e os valores respeitam o contrato. Registry Validation verifica que os artefactos referenciados existem, que a identidade e versão são explícitas e que a utilização é elegível, incluindo a resolução de dependências.
- Zod materializa a validação nas fronteiras apropriadas, sem exigir comportamento strict indiscriminado em objetos internos.
- Este baseline é documental: não implica schema executável, registry físico ou infraestrutura na Fase 0.

## 4. Governação de templates e padrões

Templates e artefactos reutilizáveis registados seguem o mesmo ciclo de vida:

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

- Apenas artefactos APPROVED ou PRODUCTION podem ser selecionados para novos artefactos, novas versões e novas dependências; PRODUCTION é a escolha default para novas gerações. Um consumidor aprovado/production pode continuar a usar uma dependência DEPRECATED que já tenha fixado, conforme as regras abaixo.
- Todo artefacto reutilizável é versionado e tem estado de aprovação rastreável.
- Dependências são referenciadas por identidade e versão explícita. Marcar uma dependência como DEPRECATED não invalida retroativamente a referência já fixada por um consumidor aprovado/production, nem desencadeia cascata automática de invalidação. Uma nova versão do consumidor deve atualizar a dependência quando necessário.
- Uma alteração incompatível exige nova versão ou processo explícito de migração.
- Um novo template deve reutilizar o Design System, componentes e padrões existentes. A criação de um novo padrão deve ser uma decisão arquitetural explícita e documentada.
- Templates não aprovados e opções fora de contrato são inelegíveis para produção.

### Baseline do registry

O Registry é o catálogo versionado dos artefactos reutilizáveis da Factory: Components, Sections, Layouts, Templates, Themes e Features, incluindo versões, estados, dependências e metadados de elegibilidade. Não cadastra nem armazena os dados específicos de cada cliente. Business Data — como nome, descrição, contactos, morada, horários e imagens — é entrada da instância e é validada pelo Business Data Contract.

O Registry físico da FOUNDATION será JSON canónico, versionado pelo Git, em `src/registry/registry.json`, validado pelo schema Zod em `src/registry/schema.ts`. Contém metadados de catálogo e resolução, não os próprios artefactos nem Business Data. Esta é uma decisão documental; não criar agora esses ficheiros.

O schema do Registry contempla, conforme necessário, identidade, tipo, versão, estado, dependências versionadas e dados de elegibilidade. Entradas ausentes não são implicitamente permitidas. Apenas artefactos APPROVED ou PRODUCTION podem ser escolhidos para novos artefactos/versões; `PRODUCTION` é o default recomendado para novas gerações. Uma referência já fixada a uma dependência DEPRECATED por consumidor aprovado/production mantém-se válida conforme as regras acima. O estado `PRODUCTION` não significa que websites gerados partilhem um runtime de produção.

## 5. Golden Standard

O Golden Standard é a implementação de referência que estabelece o padrão técnico, visual, estrutural e de qualidade para novos componentes, sections, layouts e templates.

Não exige semelhança visual entre templates. Exige equivalência de padrão em arquitetura, organização do código, Design System, acessibilidade, responsividade, SEO, performance, testes, tratamento de erros, documentação e versionamento.

## 6. Decisão técnica aprovada: TypeScript

TypeScript é obrigatório para o core da plataforma, incluindo contratos e automação do core. A decisão não escolhe framework, infraestrutura ou persistência.

## 7. Contratos obrigatórios antes da implementação

| Contrato | Responsabilidade e conteúdo mínimo específico | Deve impedir |
| --- | --- | --- |
| Component Contract | API/configuração permitida, estados, acessibilidade e tokens de design aceites. | Props arbitrárias, estilos fora do Design System e comportamento inconsistente. |
| Section Contract | Dados requeridos/opcionais, componentes permitidos, condição semântica e posição/compatibilidade. | Duplicação de sections e acoplamento de conteúdo ao layout. |
| Layout Contract | Zonas, composição, ordem e opções aprovadas de organização. | Layouts ad hoc e alteração estrutural por cliente. |
| Template Contract | Versão, categoria/variante, sections required/optional/conditional, compatibilidades e elegibilidade. | Uso de template/variante não aprovado ou incompatível. |
| Theme Contract | Tokens visuais canónicos, opções de tipografia/cores e limites de aplicação, desacoplados do framework CSS. | Valores visuais fora dos tokens e limites permitidos. |
| Business Data Contract | Campos semânticos, tipos conceituais, obrigatoriedade e condições de validade. | Dados inválidos, ausentes ou ligados à apresentação. |
| Feature Contract | Feature disponível, nível, pré-condições, dependências e compatibilidades. | Funcionalidades LEVEL 3 e integrações fora do template aprovado. |

Os campos comuns definidos na secção 3 aplicam-se a todos os contratos. Este baseline fixa conteúdo e responsabilidade, não sintaxe, serialização ou tecnologia de validação.

O Theme Contract é a fonte de verdade dos tokens visuais. O fluxo visual é `Theme Contract → tokens validados → CSS Custom Properties → Tailwind/componentes`. CSS Custom Properties são a ponte canónica para a camada visual; Tailwind consome esses tokens e não é a fonte de verdade do Design System. O Theme Contract permanece desacoplado do framework CSS.

## 8. Limites da IA

A IA opera dentro dos contratos aprovados: pode classificar empresas, selecionar templates e componentes aprovados, gerar conteúdo estruturado, preencher dados e sugerir configurações disponíveis.

Não pode inventar arquitetura de produção, criar componentes arbitrários durante a geração, ignorar contratos, utilizar templates não aprovados ou fazer deploy de uma versão que falhou os critérios de qualidade.

## 9. Qualidade como porta de controlo

O fluxo futuro deve bloquear versões que não cumpram build, TypeScript, lint, responsive design, accessibility validation, SEO fundamentals, performance validation, E2E validation e visual validation quando aplicável.

Os gates são aplicados por fase. Cada gate aplicável resulta em PASS, FAIL ou EXCEPTION; NOT_APPLICABLE significa que o requisito continua pertencendo ao produto, mas não é critério de conclusão da fase, e nunca equivale a PASS. Na FOUNDATION, typecheck, lint, unit tests, E2E e build são aplicáveis e têm de passar. As flags `--passWithNoTests` e `--pass-with-no-tests` não podem permanecer nos comandos oficiais de teste ao encerrar a FOUNDATION. Lighthouse e Visual Regression têm estado NOT_APPLICABLE nesta fase. Quando ativados numa fase posterior, aplicam-se os thresholds Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90 e Visual Regression = 0 regressões não aprovadas. EXCEPTION só existe quando um gate aplicável não é cumprido e há aprovação formal conforme a secção 12.

O Golden Standard da FOUNDATION deve ser validado contra o build de produção/final: gerar, construir o output final, servir esse output localmente e executar E2E, incluindo um perfil mobile representativo. Não é necessário hosting de produção.

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

## 12. Baseline de aprovação, exceção e níveis

- O Product Owner aprova decisões de produto e exceções de produto; o Engineering Reviewer aprova decisões técnicas e exceções técnicas. O mesmo indivíduo pode exercer ambos os papéis no estágio atual, desde que a decisão registe qual papel está a exercer.
- Aprovações e exceções devem ser rastreáveis no histórico de revisão do repositório, identificando a decisão, o âmbito/versão e o papel aprovador; não é necessário criar um sistema ou documento de aprovação separado.
- Uma entrada só passa a `APPROVED` depois de obter as aprovações de produto e técnica aplicáveis ao seu âmbito e de cumprir os critérios obrigatórios. `PRODUCTION` identifica a versão aprovada recomendada para novas gerações.
- Uma exceção deve registar o artefacto e versão afetados, regra/gate, justificação, impacto, mitigação quando aplicável, papel e aprovador, data e prazo ou condição de encerramento. A aprovação cabe ao papel responsável pela regra; exceções que afetem produto e técnica requerem ambos os papéis.
- A exceção limita-se ao âmbito e período registados; não altera o estado global nem a elegibilidade do artefacto. Uma exceção não pode aprovar artefacto inelegível nem tornar LEVEL 3 elegível para geração automática.
- LEVEL 1 aceita dados da instância nos campos e regras do Business Data Contract; esses valores não têm de constar do Registry. LEVEL 2 seleciona artefactos/opções reutilizáveis autorizados pelo Registry. Valores contratuais ou estruturais desconhecidos/não autorizados são rejeitados, não inferidos nem completados por implementação ou IA.
- LEVEL 3 exige desenvolvimento personalizado fora do fluxo de geração automática do MVP. Um pedido LEVEL 3 interrompe esse fluxo e requer decisão separada; não existe bypass por EXCEPTION.

## 13. Critérios de entrada na Fase 1

A Fase 1 — FOUNDATION — começa quando todos os critérios seguintes estiverem cumpridos:

1. O baseline documental dos sete contratos e do registry desta arquitetura está aprovado pelo papel técnico, com aprovação do Product Owner quando a decisão afetar comportamento ou opções de produto.
2. As regras de aprovação, exceção e LEVEL 1/2/3 da secção 12 estão aprovadas pelo Product Owner e pelo Engineering Reviewer nos respetivos âmbitos.
3. `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `AGENTS.md` e `README.md` não se contradizem sobre estados, elegibilidade, autoridade ou limites de geração.
4. O escopo da Fase 1 está definido na secção 17 de `PRODUCT_SPEC.md`; inclui explicitamente a criação do primeiro registry físico versionado no repositório.
5. A fundação técnica está limitada à stack aprovada em `STACK_EVALUATION.md`; nenhum serviço pago ou infraestrutura futura é pré-requisito de entrada.

Se qualquer critério estiver por cumprir, a entrada fica bloqueada até haver aprovação ou resolução documentada. Os quality gates aprovados continuam a aplicar-se às versões candidatas conforme o escopo e a validação definidos para a Fase 1; ferramentas ainda não escolhidas não são condição para fechar a Fase 0.

## 14. FOUNDATION — Fase 1

FOUNDATION significa **fundação técnica + primeiro padrão validável**. O seu objetivo é produzir artefactos verificáveis que estabeleçam a base para replicação posterior.

### Entregáveis incluídos

- Fundação local de Next.js, React, TypeScript, Tailwind CSS, ESLint, Prettier, Vitest e Playwright, conforme a stack aprovada.
- Estrutura inicial replicável do projeto, sem exigir monorepo, serviços ou infraestrutura não aprovados.
- Base contratual dos sete contratos canónicos. A FOUNDATION inclui o primeiro baseline executável de Business Data, Theme, Feature e Template. Component, Section e Layout permanecem contratos canónicos; a implementação e validação dos sete podem ter profundidades diferentes conforme o que o Golden Standard v0.1 efetivamente exercita.
- Primeiro registry físico, versionado no repositório, cujas entradas respeitam os metadados e regras de elegibilidade definidos na secção 4.
- Design System v0.1.
- Golden Standard v0.1 como primeiro padrão de referência que valida a composição dos contratos centrais e do Design System.
- Quality baseline executável: typecheck, lint, unit tests, E2E e build.

O fluxo E2E deve testar o output servido após build de produção/final e incluir perfil mobile representativo. Lighthouse e Visual Regression são NOT_APPLICABLE na FOUNDATION, sem serem considerados PASS.

### Exclusões

A Fase 1 não inclui múltiplos templates, geração automática por IA, scraping, leads/CRM, automação comercial, database, hosting de produção, pagamentos ou sistema de clientes. Não se deve introduzir substituto técnico ou infraestrutura que antecipe esses itens.

### Critério de conclusão

A Fase 1 está concluída quando todos os entregáveis acima existem como artefactos verificáveis, a base dos sete contratos está definida e existe baseline executável de Business Data, Theme, Feature e Template. A implementação e validação dos sete devem cobrir o que o Golden Standard v0.1 efetivamente exercita; o manifesto é produzido no output; e typecheck, lint, unit tests, E2E no output de build final (incluindo perfil mobile) e build passam. Ausência de testes não pode ser tratada como sucesso. Lighthouse e Visual Regression ficam NOT_APPLICABLE nesta fase; EXCEPTION só se aplica a um gate aplicável falhado e aprovado formalmente conforme a secção 12. Nenhum item excluído pode ter sido introduzido.

## 15. Decisões futuras

- estrutura exata do monorepo;
- database;
- hosting;
- CI/CD;
- ferramenta de IA;
- ferramenta de visual regression;
- estratégia definitiva de deploy.
