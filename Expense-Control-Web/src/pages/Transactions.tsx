import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { User, Category, Transaction } from '../types';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number | string>('');
  const [type, setType] = useState<number>();
  const [userId, setUserId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const fetchData = async () => {
    try {
      const [resTrans, resUsers, resCats] = await Promise.all([
        api.get<Transaction[]>('/Transactions'),
        api.get<User[]>('/Users'),
        api.get<Category[]>('/Categories'),
      ]);
      setTransactions(resTrans.data);
      setUsers(resUsers.data);
      setCategories(resCats.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/Transactions', {
        description,
        value: Number(value),
        type,
        userId: Number(userId),
        categoryId: Number(categoryId),
      });
      setDescription('');
      setValue('');
      fetchData();
      alert('Transação realizada');
    } catch (err: any) {
      alert(err.response?.data || 'Erro na transação');
    }
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 text-gray-800 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 outline-none transition-all text-sm';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex flex-col items-center transition-colors">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
            Transações
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Registre entradas e saídas financeiras
          </p>
        </header>

        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-blue-100/50 dark:shadow-none border border-blue-50 dark:border-gray-700 mb-12 transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Descrição
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Aluguel, Salário..."
                className={fieldClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Valor (R$)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                className={fieldClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(Number(e.target.value))}
                className={`${fieldClass} cursor-pointer`}
              >
                <option value={1}>Receita</option>
                <option value={2}>Despesa</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Responsável
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`${fieldClass} cursor-pointer`}
                required
              >
                <option value="">Quem está pagando / recebendo?</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`${fieldClass} cursor-pointer`}
                required
              >
                <option value="">Vincular a uma categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="cursor-pointer w-full h-[46px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-black py-2 rounded-2xl shadow-lg transition-all transform active:scale-95 uppercase text-xs tracking-widest"
              >
                Salvar Lançamento
              </button>
            </div>
          </div>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-center">Tipo de Transação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-400 dark:text-gray-500">
                    {new Date(t.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{t.categoryName}</td>
                  <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200 text-sm">{t.userName}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">{t.description}</td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-800 dark:text-white text-sm">
                    R$ {t.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-bold text-[10px] uppercase ${t.type === 'Recipe' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}
                    >
                      {t.type === 'Recipe' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
