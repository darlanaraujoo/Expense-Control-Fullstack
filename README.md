Expense Control - Sistema de Gestão Financeira
O Expense Control é uma aplicação Fullstack desenvolvida para facilitar o controle de gastos e receitas residenciais. O sistema permite o gerenciamento de perfis de usuários, categorias financeiras personalizadas e o registro detalhado de transações, oferecendo uma visão clara da saúde financeira através de relatórios consolidados.

Tecnologias Utilizadas
Back-end
Framework: .NET 8.

Banco de Dados: SQLite (Relacional, leve e portátil).

ORM: Entity Framework Core.

Testes: xUnit e Moq (Mocks de repositórios).

Front-end
Biblioteca: React 19 (Vite).

Linguagem: TypeScript.

Estilização: Tailwind CSS v4.

Consumo de API: Axios.

Funcionalidades e Regras de Negócio
1. Gestão de Usuários (Perfis)
Cadastro de usuários com nome e idade.

Regra: Idade mínima de 7 anos para cadastro.

Exclusão em cascata (ao remover um usuário, suas categorias e transações são removidas).

2. Categorias Financeiras
Criação de categorias com finalidades específicas: Receita, Despesa ou Ambas.

Vinculação obrigatória a um dono (usuário).

3. Transações Financeiras
Lançamentos de entrada e saída com descrição, valor e data.

Regra de Idade: Usuários menores de 18 anos não podem registrar receitas.

Regra de Consistência: Bloqueio de lançamentos cujo tipo (Receita/Despesa) divirja do propósito da categoria selecionada.

4. Relatórios
Dashboard com Total de Receitas, Total de Despesas e Saldo Líquido.

Listagem de saldos individuais por membro da residência.

Garantia de Qualidade (Testes)
O sistema conta com testes unitários focados na camada de Application, garantindo que as regras de negócio sejam respeitadas independentemente da interface.

Exemplos de Testes:

CreateAsync_ShouldThrowException_WhenUserIsYoungerThan7

CreateAsync_RecipeWithExpenseCategory_ThrowsException

Pré-requisitos
Para rodar o projeto localmente, você precisará de:

Back-end: .NET SDK 8.0+.

Front-end: Node.js v18.0+.

Como Executar
API:

Bash

cd ec-api
dotnet ef database update
dotnet run
Web:

Bash

cd ec-web
npm install
npm run dev
