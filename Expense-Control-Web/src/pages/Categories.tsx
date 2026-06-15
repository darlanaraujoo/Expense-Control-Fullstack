import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { User, Category } from '../types';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState<number>(3);
  const [userId, setUserId] = useState<number | string>('');

  const fetchData = async () => {
    const [resCats, resUsers] = await Promise.all([
      api.get<Category[]>('/Categories'),
      api.get<User[]>('/Users'),
    ]);
    setCategories(resCats.data);
    setUsers(resUsers.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/Categories', {
        description,
        purpose,
        userId: Number(userId),
      });
      setDescription('');
      setUserId('');
      fetchData();
      alert('Categoria criada');
    } catch (err: any) {
      alert(err.response?.data || 'Erro ao criar categoria');
    }
  };

  const purposeTranslations: Record<string, string> = {
    Recipe: 'Receita',
    Expense: 'Despesa',
    Both: 'Ambas',
  };

  const inputClass =
    'w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-center text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
        Categorias
      </h1>

      <form
        onSubmit={handleCreate}
        className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-blue-50 dark:border-gray-700 transition-colors"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Ex: Alimentação"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Finalidade
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(Number(e.target.value))}
              className={inputClass}
            >
              <option value={1}>Receita</option>
              <option value={2}>Despesa</option>
              <option value={3}>Ambas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Responsável
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={inputClass}
              required
            >
              <option value="">Selecione um Usuário...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-all"
        >
          Salvar Categoria
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-l-8 border-l-blue-500 shadow-sm hover:shadow-md border border-transparent dark:border-gray-700 transition-all"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{cat.description}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Dono:{' '}
              <span className="font-semibold text-gray-700 dark:text-gray-300">{cat.userName}</span>
            </p>
            <span
              className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                cat.purpose === 'Recipe'
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                  : cat.purpose === 'Expense'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {purposeTranslations[cat.purpose] || cat.purpose}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
