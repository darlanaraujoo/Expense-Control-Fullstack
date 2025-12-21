# Expense Control - Fullstack Project

O **Expense Control** é uma solução completa para gestão financeira residencial. Este repositório unifica a **API RESTful** desenvolvida em .NET e o **Client Web** moderno desenvolvido em React, oferecendo uma experiência de controle de gastos, receitas e relatórios consolidados.

---

## Estrutura do Repositório

O projeto está organizado em duas frentes principais, cada uma contendo sua própria documentação detalhada:

* **`Expense-Control-Api`**: Camada de back-end responsável por toda a inteligência de negócio, persistência e API REST.
* **`Expense-Control-Web`**: Camada de front-end responsável pela interface do usuário, interatividade e consumo de dados.

---

## Tecnologias e Ferramentas

### **Back-end (API)**
* **Framework:** .NET 8.
* **ORM:** Entity Framework Core para acesso a dados.
* **Banco de Dados:** SQLite (Relacional, leve e portátil).
* **Documentação:** Swagger/OpenAPI para testes de endpoints.
* **Arquitetura:** Separação de responsabilidades (Application, Domain, Infra, CrossCutting).

### **Front-end (Web)**
* **Biblioteca:** React 19 com Vite.
* **Linguagem:** TypeScript para tipagem estática.
* **Estilização:** Tailwind CSS v4 para design responsivo e moderno.
* **Consumo de API:** Axios para requisições assíncronas.
* **Navegação:** React Router DOM.

---

## Regras de Negócio Implementadas

O sistema foi blindado com regras de negócio críticas na camada de aplicação:
1. **Idade Mínima:** Cadastro de usuários permitido apenas para maiores de 7 anos.
2. **Gestão de Receitas:** Usuários menores de 18 anos estão restritos ao registro de despesas, não podendo cadastrar receitas.
3. **Consistência de Categorias:** O sistema valida se o tipo da transação (Receita/Despesa) é compatível com o propósito da categoria selecionada.

---

## Como Executar o Projeto

### **Pré-requisitos**
* .NET SDK 8.0+
* Node.js v18.0+

Para instruções detalhadas de configuração e execução, consulte o arquivo **README.md** presente dentro de cada pasta específica.

### **Execução Rápida**
```bash
# Para iniciar a API
cd Expense-Control-Api && dotnet run

# Para iniciar o Front-end
cd Expense-Control-Web && npm install && npm run dev
