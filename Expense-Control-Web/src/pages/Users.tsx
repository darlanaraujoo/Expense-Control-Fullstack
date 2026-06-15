import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROOT_ADMIN_EMAIL } from '../constants/auth';
import { Modal } from '../components/Modal';
import { UserFormModal } from '../components/UserFormModal';
import type { User } from '../types';

type ModalState = { mode: 'create' } | { mode: 'edit'; user: User } | null;

function isUserProtected(userEmail: string, currentUserEmail?: string): boolean {
  const normalized = userEmail.toLowerCase();
  return (
    normalized === ROOT_ADMIN_EMAIL.toLowerCase() ||
    normalized === currentUserEmail?.toLowerCase()
  );
}

export function Users() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<User[]>('/Users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: User) => {
    if (isUserProtected(user.email, authUser?.email)) return;
    if (!confirm(`Excluir o usuário "${user.name}"? Todos os registros associados serão removidos.`)) {
      return;
    }

    try {
      await api.delete(`/Users/${user.id}`);
      fetchUsers();
    } catch (error) {
      const message = isAxiosError(error) && typeof error.response?.data === 'string'
        ? error.response.data
        : 'Erro ao excluir usuário.';
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
              Usuários
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Gerencie os perfis cadastrados no sistema
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: 'create' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#00BFFF] dark:hover:bg-[#1565C0] text-white font-bold text-sm transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Idade</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const protected_ = isUserProtected(user.email, authUser?.email);

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200 text-sm">
                          {user.name}
                          {user.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase() && (
                            <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                              Admin
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{user.age} anos</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={protected_}
                              onClick={() => setModal({ mode: 'edit', user })}
                              title={protected_ ? 'Este usuário não pode ser editado' : 'Editar usuário'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-[#00BFFF] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              type="button"
                              disabled={protected_}
                              onClick={() => handleDelete(user)}
                              title={protected_ ? 'Este usuário não pode ser excluído' : 'Excluir usuário'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        title={modal?.mode === 'edit' ? 'Editar usuário' : 'Novo usuário'}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      >
        {modal && (
          <UserFormModal
            mode={modal.mode}
            user={modal.mode === 'edit' ? modal.user : undefined}
            onClose={() => setModal(null)}
            onSuccess={fetchUsers}
          />
        )}
      </Modal>
    </div>
  );
}
