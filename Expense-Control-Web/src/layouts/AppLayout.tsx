import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-8 py-5 text-white font-black text-sm tracking-widest transition-all border-b md:border-b-0 md:border-r border-white/20 hover:bg-[#1565C0] ${
    isActive ? 'bg-[#1565C0]' : ''
  }`;

export function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-[#00BFFF] dark:bg-[#0d47a1] w-full shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="hidden md:flex items-center gap-3 px-6 py-4 text-white">
            <span className="font-black text-sm tracking-widest uppercase">Expense Control</span>
            {user?.name && (
              <span className="text-xs font-medium text-white/70">· {user.name}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:justify-end">
            <NavLink to="/users" className={navLinkClass}>
              USUÁRIOS
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              CATEGORIAS
            </NavLink>
            <NavLink to="/transactions" className={navLinkClass}>
              TRANSAÇÕES
            </NavLink>
            <NavLink to="/reports" className={navLinkClass}>
              RELATÓRIOS
            </NavLink>
            <ThemeToggle variant="nav" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-8 py-5 text-white font-black text-sm tracking-widest transition-all hover:bg-[#1565C0] dark:hover:bg-[#1565C0]"
            >
              <LogOut className="w-4 h-4" />
              SAIR
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
