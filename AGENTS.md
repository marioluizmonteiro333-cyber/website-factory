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

## Limites atuais

Não criar aplicação, instalar dependências, criar templates, componentes, database, CI/CD ou configurar deploy sem autorização explícita.

## Source of Truth

- PRODUCT_SPEC.md define o que o produto deve fazer.
- ARCHITECTURE.md define princípios e estrutura arquitetural.
- AGENTS.md define regras de trabalho para agentes e IA.
- STACK_EVALUATION.md documenta as decisões e justificações técnicas da stack.
- Contratos técnicos futuros serão a fonte de verdade para interfaces e regras executáveis.

## Formato de resposta

1. Diagnóstico
2. Decisão técnica
3. Solução
4. Riscos/melhorias, apenas quando relevantes
