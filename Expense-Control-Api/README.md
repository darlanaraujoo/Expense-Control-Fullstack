# Expense Control API

## Visão Geral
O **Expense Control** é uma API RESTful desenvolvida para o gerenciamento de controle de gastos pessoais. O sistema permite o cadastro de usuários, categorias financeiras e transações (receitas e despesas), além de fornecer relatórios consolidados sobre a saúde financeira dos usuários.

## Tecnologias Utilizadas
*   **.NET 8**: Plataforma de desenvolvimento.
*   **Entity Framework Core**: ORM para acesso a dados.
*   **SQLite**: Banco de dados relacional leve e portátil.
*   **Swagger/OpenAPI**: Documentação interativa da API.
*   **Arquitetura em Camadas**: Separação de responsabilidades (API, Application, Domain, Infra, CrossCutting).

## Funcionalidades Principais

### 1. Gerenciamento de Usuários
*   Cadastro de novos usuários.
*   Listagem de usuários existentes.
*   Exclusão de usuários.
*   **Relatório Financeiro**: Visualização consolidada de receitas, despesas e saldo atual de cada usuário.

### 2. Gerenciamento de Categorias
*   Criação de categorias para classificar transações (ex: Alimentação, Salário, Lazer).
*   Associação de categorias a um propósito específico (Receita ou Despesa).
*   Vínculo obrigatório com um usuário.

### 3. Gerenciamento de Transações
*   Registro de entradas (Receitas) e saídas (Despesas).
*   Associação com usuários e categorias.
*   Validações de consistência financeira.

## Regras de Negócio

O sistema implementa diversas regras de negócio para garantir a integridade e consistência dos dados. Estas regras estão documentadas no código através de regiões (`#region`) e comentários explicativos.

### Usuários
*   **Idade Mínima**: A idade do usuário deve ser maior que 7 anos para o cadastro ser permitido.
*   **Exclusão Segura**: Apenas usuários existentes podem ser excluídos.

### Categorias
*   **Vínculo com Usuário**: Toda categoria deve pertencer a um usuário válido existente no banco de dados.

### Transações
*   **Restrição de Idade para Receitas**: Usuários menores de 18 anos **não podem** registrar receitas, sendo permitido apenas o registro de despesas.
*   **Consistência de Categoria**:
    *   Uma transação do tipo **Receita** só pode ser vinculada a uma categoria de propósito **Receita**.
    *   Uma transação do tipo **Despesa** só pode ser vinculada a uma categoria de propósito **Despesa**.
*   **Existência de Dependências**: Transações só podem ser criadas se o usuário e a categoria informados existirem.

## Como Executar o Projeto

### Pré-requisitos
*   .NET SDK 8.0+ instalado.
*   IDE de sua preferência (Rider, Visual Studio, VS Code).

### Passos
1.  Clone o repositório.
2.  Navegue até a pasta raiz da solução.
3.  Restaure os pacotes NuGet:
    ```bash
    dotnet restore
    ```
4.  Execute a aplicação (o banco de dados SQLite `gastos.db` será criado automaticamente na raiz do projeto `ec-api` e as migrações serão aplicadas):
    ```bash
    dotnet run --project ec-api
    ```
5.  Acesse o Swagger para testar os endpoints:
    *   Geralmente disponível em: `https://localhost:7196/swagger` ou `http://localhost:5148/swagger` (verifique o log do console para a porta correta).

## Estrutura da Solução

*   **ec-api**: Camada de apresentação (Controllers, Configurações de API).
*   **ec-api.Application**: Camada de aplicação (Services, DTOs, Regras de Negócio).
*   **ec-api.Domain**: Camada de domínio (Entidades, Interfaces de Repositório, Enums).
*   **ec-api.Infra**: Camada de infraestrutura (Contexto do EF Core, Implementação de Repositórios, Migrations).
*   **ec-api.CrossCutting**: Camada transversal (Injeção de Dependência).
