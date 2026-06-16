# 📊 Expense Control (Full-Stack)

> Um sistema SaaS completo para controle de despesas pessoais, projetado com foco em Clean Architecture, Segurança (JWT/BCrypt) e UI/UX (Dark Mode e RBAC visual).

Este repositório é um **monorepo** que contém uma solução Full-Stack completa, dividida entre uma API robusta em **.NET 8** e um Front-end moderno em **React 19 + Tailwind CSS**.

## 🚀 Tecnologias e Práticas Adotadas

### Back-End (C# / .NET 8)

- **Clean Architecture & DDD:** Separação estrita de responsabilidades (API, Application, Domain, Infra e CrossCutting).
- **Segurança Avançada:**
  - Autenticação *stateless* baseada em tokens **JWT** (JSON Web Tokens).
  - Criptografia de senhas utilizando **BCrypt**.
  - Proteção de rotas com `[Authorize]` e políticas restritivas.
- **Persistência:** Entity Framework Core integrado ao SQLite.
- **Data Seeding:** Criação automática e segura (hash) do usuário administrador (Root).

### Front-End (React / TypeScript)

- **UI/UX Moderna:** Construída com Vite e **Tailwind CSS v4** focada em experiência SaaS.
- **Proteção e Gestão de Estado:**
  - Rotas Privadas e Públicas usando `React Router DOM`.
  - Controle de sessão via `Context API` e interceptores do `Axios` para injeção automática de Bearer Tokens.
- **RBAC Visual:** Travas de segurança na interface que impedem a edição/exclusão do usuário administrador.
- **Dark Mode:** Implementação nativa global utilizando o esquema de classes do Tailwind e persistência no Local Storage.

---

## ⚙️ Quick Start (Como rodar localmente)

O projeto requer o **.NET 8 SDK** e o **Node.js (18+)** instalados.

> O sistema utiliza uma estratégia de Seed. Ao subir a API pela primeira vez, as migrations são aplicadas e o banco de dados é gerado automaticamente com um usuário de testes.

### 1. Subindo a API (.NET)

Abra um terminal na raiz do projeto e execute:

```bash
cd Expense-Control-Api
dotnet restore
dotnet run --project ec-api
```

A API estará rodando em `http://localhost:5000`. A documentação interativa **Scalar** pode ser acessada em `http://localhost:5000/scalar`.

### 2. Subindo o Front-End (React)

Abra outro terminal na raiz do projeto e execute:

```bash
cd Expense-Control-Web
npm install
npm run dev
```

O sistema estará rodando na porta padrão do Vite: `http://localhost:5173`.

### 3. Credenciais de Acesso

Acesse o front-end e utilize as credenciais padrão (Seed) geradas pelo banco:

| Campo   | Valor               |
|---------|---------------------|
| E-mail  | `admin@email.com`   |
| Senha   | `admin123`          |

---

## 🏗️ Estrutura do Monorepo

| Pasta | Descrição |
|-------|-----------|
| 📁 [Expense-Control-Api/](Expense-Control-Api/) | API REST em .NET 8 — [ver documentação](Expense-Control-Api/README.md) |
| 📁 [Expense-Control-Web/](Expense-Control-Web/) | Front-end React + TypeScript — [ver documentação](Expense-Control-Web/README.md) |
