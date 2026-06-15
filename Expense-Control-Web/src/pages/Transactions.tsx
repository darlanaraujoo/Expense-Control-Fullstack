import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { TransactionFormModal } from '../components/TransactionFormModal';
import { useToast } from '../hooks/useToast';
import { resolveApiError } from '../utils/apiError';
import { canManageRecord } from '../utils/permissions';
import type { Category, Transaction, User } from '../types';

type ModalState = { mode: 'create' } | { mode: 'edit'; transaction: Transaction } | null;

export function Transactions() {
  const { user: authUser } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resTrans, resUsers, resCats] = await Promise.all([
        api.get<Transaction[]>('/Transactions'),
        api.get<User[]>('/Users'),
        api.get<Category[]>('/Categories'),
      ]);
      setTransactions(resTrans.data);
      setUsers(resUsers.data);
      setCategories(resCats.data);
    } catch (error) {
      console.error(error);
      showToast(resolveApiError(error, 'Erro ao carregar transações.'));
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (transaction: Transaction) => {
    if (!canManageRecord(transaction.userId, authUser)) return;

    if (!confirm(`Excluir a transação "${transaction.description}"?`)) return;

    try {
      await api.delete(`/Transactions/${transaction.id}`);
      showToast('Transação excluída com sucesso.', 'success');
      fetchData();
    } catch (error) {
      showToast(resolveApiError(error, 'Erro ao excluir transação.'));
    }
  };

  const handleSuccess = () => {
    showToast(
      modal?.mode === 'edit'
        ? 'Transação atualizada com sucesso.'
        : 'Transação criada com sucesso.',
      'success',
    );
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
              Transações
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              Registre entradas e saídas financeiras
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: 'create' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#00BFFF] dark:hover:bg-[#1565C0] text-white font-bold text-sm transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4 text-center">Tipo</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Carregando transações...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma transação registrada.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => {
                    const canManage = canManageRecord(transaction.userId, authUser);

                    return (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {transaction.categoryName}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200 text-sm">
                          {transaction.userName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-800 dark:text-white text-sm">
                          R$ {transaction.value.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`font-bold text-[10px] uppercase ${
                              transaction.type === 'Recipe'
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}
                          >
                            {transaction.type === 'Recipe' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={!canManage}
                              onClick={() => setModal({ mode: 'edit', transaction })}
                              title={
                                canManage
                                  ? 'Editar transação'
                                  : 'Você só pode editar suas próprias transações'
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-[#00BFFF] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              type="button"
                              disabled={!canManage}
                              onClick={() => handleDelete(transaction)}
                              title={
                                canManage
                                  ? 'Excluir transação'
                                  : 'Você só pode excluir suas próprias transações'
                              }
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
        title={modal?.mode === 'edit' ? 'Editar transação' : 'Nova transação'}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
      >
        {modal && (
          <TransactionFormModal
            mode={modal.mode}
            transaction={modal.mode === 'edit' ? modal.transaction : undefined}
            users={users}
            categories={categories}
            onClose={() => setModal(null)}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </div>
  );
}
