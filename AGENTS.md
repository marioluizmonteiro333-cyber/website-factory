# Instruções de Trabalho

## Objetivo

Produzir soluções técnicas de alta qualidade com o mínimo de tokens e máxima precisão para o Website Factory.

## Princípios

- Verdade acima de fluência.
- Clareza acima de criatividade.
- Soluções acima de explicações.
- Eficiência acima de texto.
- Não assumir contexto não fornecido.
- Não inventar decisões técnicas não aprovadas.

## Regras do projeto

- Não duplicar código sem necessidade.
- Reutilizar componentes existentes.
- Manter templates orientados por dados e conteúdo separado da apresentação.
- Versionar templates e bloquear os não aprovados em produção.
- Manter IA dentro de padrões e contratos aprovados.
- Garantir que código, alterações e saídas possam ser testados e validados.
- Não introduzir dependências sem justificação aprovada.
- Não antecipar infraestrutura complexa.
- Priorizar ferramentas gratuitas, open source, execução e infraestrutura locais enquanto não houver orçamento.
- Usar Git para versionamento e GitHub como repositório principal.
- Tratar o Golden Standard como referência obrigatória de arquitetura e qualidade.
- Implementações não devem contradizer contratos ou decisões aprovadas. Em caso de conflito, interromper a implementação e reportar a contradição para revisão.

## Processo de alteração

1. Confirmar o problema e o escopo.
2. Reutilizar padrões existentes antes de criar novos.
3. Separar dados, apresentação e regras estruturais.
4. Validar a alteração de acordo com critérios definidos.
5. Documentar decisões estruturais aprovadas.

## Limites de implementação

- A Fase 0 está fechada. Na FOUNDATION, implementar somente os entregáveis aprovados em PRODUCT_SPEC.md e ARCHITECTURE.md.
- Não antecipar múltiplos templates, geração automática por IA, scraping, leads/CRM, automação comercial, database, hosting de produção, pagamentos ou sistema de clientes.
- Fora do escopo explícito da FOUNDATION, não criar aplicação, instalar dependências, criar templates/componentes adicionais, database, CI/CD ou configurar deploy sem aprovação explícita.

## Source of Truth

- PRODUCT_SPEC.md define o que o produto deve fazer.
- ARCHITECTURE.md define princípios e estrutura arquitetural.
- AGENTS.md define regras de trabalho para agentes e IA.
- STACK_EVALUATION.md documenta as decisões e justificações técnicas da stack.
- Contratos técnicos futuros serão a fonte de verdade para interfaces e regras executáveis.

## Regras operacionais da Fase 0

- Aplicar os baselines de contrato e registry definidos em ARCHITECTURE.md e as regras de produto/qualidade em PRODUCT_SPEC.md.
- LEVEL 1 limita os dados específicos da instância aos campos e regras do Business Data Contract; não exigir que valores de cliente constem do Registry.
- LEVEL 2 usa apenas artefactos/opções explicitamente autorizados pelo Registry e com versões/dependências válidas. Não criar alternativas nem presumir que uma opção ausente está permitida.
- LEVEL 3 altera ou expande capacidades da Factory e não pode ser introduzido arbitrariamente pela IA, nem entrar na geração automática por EXCEPTION.
- O Product Owner aprova produto e exceções de produto; o Engineering Reviewer aprova aspetos técnicos e exceções técnicas. A mesma pessoa pode exercer ambos os papéis, mas deve indicar o papel em cada aprovação.
- Exceções devem ser explícitas, rastreáveis e limitadas ao âmbito aprovado; não alteram a elegibilidade global.
- Se o pedido não puder ser validado contra os contratos/registry, ou houver contradição entre documentos, não improvisar: parar e reportar a decisão em falta.

## Limites da Fase 1 — FOUNDATION

- FOUNDATION inclui apenas a fundação técnica e o primeiro padrão validável, conforme o escopo e exclusões em PRODUCT_SPEC.md e ARCHITECTURE.md.
- A fundação técnica usa Next.js, React, TypeScript, Tailwind CSS, ESLint, Prettier, Vitest e Playwright; entregar também a estrutura inicial replicável do projeto.
- Estabelecer a base contratual dos sete contratos canónicos (Component, Section, Layout, Template, Theme, Business Data e Feature); a profundidade executável e de validação depende do que o Golden Standard v0.1 exercita.
- O Registry físico definido para FOUNDATION é `src/registry/registry.json` com schema Zod em `src/registry/schema.ts`; não contém dados específicos de clientes nem os próprios artefactos.
- Seguir o modelo de geração de websites independentes; o output inclui Build Manifest reproduzível, e Next.js é a engine de rendering/build, não o modelo de produto da Factory.
- Entregar Design System v0.1, Golden Standard v0.1 e quality baseline de typecheck, lint, unit tests, E2E e build.
- Não antecipar múltiplos templates, geração automática por IA, scraping, leads/CRM, automação comercial, database, hosting de produção, pagamentos ou sistema de clientes.
- No encerramento da FOUNDATION, comandos de teste não podem usar bypass de ausência de testes (`--passWithNoTests` / `--pass-with-no-tests`).
- Validar E2E contra o output de build final servido localmente, incluindo perfil mobile representativo; Lighthouse e Visual Regression são NOT_APPLICABLE nesta fase, não PASS.
- A estrutura deve ser replicável sem pressupor monorepo, serviços ou infraestrutura futura. Se um requisito parecer exigir algo excluído ou não aprovado, parar e reportar a decisão em falta.

## Formato de resposta

1. Diagnóstico
2. Decisão técnica
3. Solução
4. Riscos/melhorias, apenas quando relevantes
