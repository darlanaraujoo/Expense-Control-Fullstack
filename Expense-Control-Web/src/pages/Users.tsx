import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types/index';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>('/Users');
      setUsers(response.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/Users', { 
        name,
        age: age === '' ? 0 : Number(age) });
      setName(''); 
      setAge(''); 
      fetchUsers();
      alert("Usuário criado");
    } catch (err: any) { alert(err.response?.data || "Erro ao cadastrar"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir esta pessoa apagará todos os seus registros. Continuar?")) return;
    try {
      await api.delete(`/Users/${id}`);
      fetchUsers();
    } catch (err) { alert("Erro ao excluir"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-center text-3xl font-black text-gray-800 tracking-tight uppercase">Cadastrar</h1>
          <p className="text-gray-500 text-sm font-medium">Gerenciar perfis</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nome Completo</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all text-sm"
                required 
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Idade</label>
                <input 
                  type="number" value={age} onChange={(e) => setAge(e.target.value)}
                  placeholder='Ex: 8 anos '
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none text-sm appearance-none" 
                  required 
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm">
                  ADICIONAR
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Lista */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>Nome</span>
            <span>Ações</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {users.map(user => (
              <li key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-700 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.age} anos</p>
                </div>
                <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 font-bold text-[10px] uppercase">
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}