# Expense Control API

## Visão Geral
O **Expense Control** é uma API RESTful desenvolvida para o gerenciamento de controle de gastos pessoais. O sistema permite o cadastro de usuários, categorias financeiras e transações (receitas e despesas), além de fornecer relatórios consolidados sobre a saúde financeira dos usuários.

## Tecnologias Utilizadas
*   **.NET 8**: Plataforma de desenvolvimento.
*   **Entity Framework Core 8.0.11**: ORM para acesso a dados.
*   **PostgreSQL**: Banco de dados relacional (via `Npgsql.EntityFrameworkCore.PostgreSQL`).
*   **Scalar + OpenAPI (Swashbuckle)**: Documentação interativa da API em `/scalar`, com especificação OpenAPI em `/swagger/v1/swagger.json`.
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
*   **PostgreSQL 14+** instalado e em execução.
*   Ferramenta global do EF Core (opcional, para migrations):
    ```bash
    dotnet tool install --global dotnet-ef
    ```
*   IDE de sua preferência (Rider, Visual Studio, VS Code).

### Configuração do banco de dados

1. Crie o database no PostgreSQL:

    ```sql
    CREATE DATABASE "ExpenseControl";
    ```

2. Configure a connection string em `ec-api/appsettings.json`:

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Port=5432;Database=ExpenseControl;Username=postgres;Password=suasenha"
      }
    }
    ```

    | Parâmetro  | Descrição                          |
    |------------|------------------------------------|
    | `Host`     | Endereço do servidor (ex: `localhost`) |
    | `Port`     | Porta padrão `5432`                |
    | `Database` | Nome do banco: `ExpenseControl`    |
    | `Username` | Usuário do PostgreSQL             |
    | `Password` | Senha do usuário                  |

### Passos

1. Clone o repositório.
2. Navegue até a pasta da solução (`Expense-Control-Api`).
3. Restaure os pacotes NuGet:
    ```bash
    dotnet restore
    ```
4. Aplique as migrations no PostgreSQL:
    ```bash
    dotnet ef database update --project ec-api.Infra --startup-project ec-api
    ```
5. Execute a aplicação (as migrations também são aplicadas no startup via seed, e o usuário administrador padrão é criado automaticamente):
    ```bash
    dotnet run --project ec-api
    ```
6. Acesse o **Scalar** para explorar e testar os endpoints:
    *   Documentação interativa: `http://localhost:5000/scalar`
    *   Especificação OpenAPI (JSON): `http://localhost:5000/swagger/v1/swagger.json`
    *   Autentique-se via `POST /api/Users/login` e envie o token JWT no cabeçalho `Authorization: Bearer {token}` nas rotas protegidas.

### Comandos úteis de migrations

```bash
# Criar uma nova migration
dotnet ef migrations add NomeDaMigration --project ec-api.Infra --startup-project ec-api

# Aplicar migrations pendentes
dotnet ef database update --project ec-api.Infra --startup-project ec-api

# Reverter para a migration anterior
dotnet ef database update NomeMigrationAnterior --project ec-api.Infra --startup-project ec-api
```

## Usuário padrão (desenvolvimento)

Na primeira execução, o sistema cria automaticamente um usuário base caso ele ainda não exista:

| Campo | Valor |
|---|---|
| E-mail | `admin@email.com` |
| Senha | `admin123` |

> **Atenção:** altere ou remova este usuário em ambientes de produção.

## Estrutura da Solução

*   **ec-api**: Camada de apresentação (Controllers, Configurações de API).
*   **ec-api.Application**: Camada de aplicação (Services, DTOs, Regras de Negócio).
*   **ec-api.Domain**: Camada de domínio (Entidades, Interfaces de Repositório, Enums).
*   **ec-api.Infra**: Camada de infraestrutura (Contexto do EF Core, Implementação de Repositórios, Migrations).
*   **ec-api.CrossCutting**: Camada transversal (Injeção de Dependência).
