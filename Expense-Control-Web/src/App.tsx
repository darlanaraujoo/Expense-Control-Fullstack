import { useState } from 'react';
import { Users } from './pages/Users';
import { Categories } from './pages/Categories';
import { Transactions } from './pages/Transactions';
import { Reports} from './pages/Reports';

function App() {
  // Adicionei 'transactions' e 'report' para o futuro
  const [page, setPage] = useState<'users' | 'categories' | 'transactions' | 'report'>('users');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu de Navegação */}
      <nav className="bg-[#00BFFF] w-full shadow-lg">
        {/* Container que centraliza o conteúdo do menu se a tela for muito larga */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-end">
          
          {/* Botão Cadastros */}
          <button 
            onClick={() => setPage('users')}
            className={`px-8 py-5 text-white font-black text-sm tracking-widest transition-all border-b md:border-b-0 md:border-r border-white/20 hover:bg-[#1565C0] ${
              page === 'users' ? 'bg-[#1565C0]' : ''
            }`}
          >
            CADASTROS
          </button>

          {/* Botão Categorias */}
          <button 
            onClick={() => setPage('categories')}
            className={`px-8 py-5 text-white font-black text-sm tracking-widest transition-all border-b md:border-b-0 md:border-r border-white/20 hover:bg-[#1565C0] ${
              page === 'categories' ? 'bg-[#1565C0]' : ''
            }`}
          >
            CATEGORIAS
          </button>

          {/* Botão Transações */}
          <button 
            onClick={() => setPage('transactions')}
            className={`px-8 py-5 text-white font-black text-sm tracking-widest transition-all border-b md:border-b-0 md:border-r border-white/20 hover:bg-[#1565C0] ${
              page === 'transactions' ? 'bg-[#1565C0]' : ''
            }`}
          >
            TRANSAÇÕES
          </button>

          {/* Botão Relatórios */}
          <button 
            onClick={() => setPage('report')}
            className={`px-8 py-5 text-white font-black text-sm tracking-widest transition-all hover:bg-[#1565C0] ${
              page === 'report' ? 'bg-[#1565C0]' : ''
            }`}
          >
            RELATÓRIOS
          </button>
        </div>
      </nav>

      {/* Conteúdo Dinâmico */}
      <main className="container mx-auto">
        {page === 'users' && <Users />}
        {page === 'categories' && <Categories />}
        {page === 'transactions' && <Transactions />}
        {page === 'report' && <Reports />}
      </main>
    </div>
  );
}

export default App;