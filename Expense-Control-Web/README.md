# Expense Control Web

Aplicação web para controle de despesas pessoais, desenvolvida com React, TypeScript e Vite. O sistema permite gerenciar usuários, categorias financeiras e transações, além de fornecer relatórios consolidados de gastos e receitas.

## Tecnologias Utilizadas

- **React** (v19)
- **TypeScript**
- **Vite**
- **Tailwind CSS** (v4)
- **Axios** (para consumo de API)
- **React Router DOM**

## Funcionalidades

### 1. Gestão de Usuários (Cadastros)
- Cadastro de novos usuários com Nome e Idade.
- Listagem de usuários cadastrados.
- Exclusão de usuários (com remoção em cascata de seus registros).

### 2. Gestão de Categorias
- Criação de categorias financeiras.
- Definição de finalidade da categoria:
  - **Receita**: Para entradas de dinheiro.
  - **Despesa**: Para saídas de dinheiro.
  - **Ambas**: Pode ser usada para ambos.
- Vinculação de categorias a um usuário específico (Dono).

### 3. Gestão de Transações
- Registro de entradas (Receitas) e saídas (Despesas).
- Campos: Descrição, Valor, Tipo, Usuário Responsável e Categoria.
- Histórico de transações com data, valor e detalhes.

### 4. Relatórios
- Visão geral financeira.
- Totais de Receitas e Despesas.
- Saldo Líquido Geral.
- Detalhamento por usuário (Receitas, Despesas e Saldo Individual).

## Regras de Negócio

- **Categorias**: Cada categoria deve pertencer a um usuário e ter uma finalidade definida (Receita, Despesa ou Ambas).
- **Transações**: Toda transação deve estar vinculada a um usuário e a uma categoria existente.
- **Exclusão**: A exclusão de um usuário é uma operação crítica que remove todos os dados associados a ele.
- **API**: A aplicação consome uma API REST rodando em `http://localhost:5000/api`.

## Instalação e Execução

### Pré-requisitos
- Node.js instalado.
- Backend da aplicação rodando (necessário para funcionamento completo).

### Passos

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. O projeto estará acessível em `http://localhost:5173` (porta padrão do Vite).

## Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa a verificação de código com ESLint.
- `npm run preview`: Visualiza a versão de produção localmente.

## Estrutura do Projeto

- `src/pages`: Componentes das páginas principais (Users, Categories, Transactions, Reports).
- `src/services`: Configuração do Axios e chamadas à API.
- `src/types`: Definições de tipos TypeScript (Interfaces).
- `src/App.tsx`: Componente principal e configuração de rotas/navegação.

---
Desenvolvido como parte do projeto Expense Control.
