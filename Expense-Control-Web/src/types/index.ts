// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createAt: string;
}

export interface Category {
  id: number;
  description: string;
  purpose: string; //Receita, Despesa, Ambos(a)
  userName: string;
}

export interface Transaction {
  id: number;
  description: string;
  value: number;
  type: string; //Receita, Despesa
  categoryName: string;
  userName: string;
  transactionDate: string;
}

export interface UserReportItem {
  name: string;
  totalRecipes: number;
  totalExpenses: number;
  balance: number;
}

export interface UserReportResponse {
  people: UserReportItem[];
  generalTotalRecipes: number;
  generalTotalExpenses: number;
  generalNetBalance: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user?: AuthUser;
}
