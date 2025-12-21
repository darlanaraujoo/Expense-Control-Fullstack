import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { UserReportResponse } from '../types';

export function Reports() {
  const [report, setReport] = useState<UserReportResponse | null>(null);

  useEffect(() => {
    api.get<UserReportResponse>('/Users/report')
      .then(response => setReport(response.data))
      .catch(err => console.error("Erro ao carregar relatório:", err));
  }, []);

  if (!report) return <div className="p-8 text-center">A carregar relatórios...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-center text-3xl font-black text-gray-800 tracking-tight uppercase">Relatório Geral de Gastos</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-green-600 font-bold uppercase text-xs">Total Receitas</p>
          <p className="text-2xl font-black text-green-700">R$ {report.generalTotalRecipes.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-600 font-bold uppercase text-xs">Total Despesas</p>
          <p className="text-2xl font-black text-red-700">R$ {report.generalTotalExpenses.toFixed(2)}</p>
        </div>
        <div className={`p-6 rounded-lg border ${report.generalNetBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <p className="font-bold uppercase text-xs">Saldo Líquido</p>
          <p className={`text-2xl font-black ${report.generalNetBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            R$ {report.generalNetBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4">Usuário</th>
              <th className="p-4">Receitas</th>
              <th className="p-4">Despesas</th>
              <th className="p-4 text-right">Saldo Individual</th>
            </tr>
          </thead>
          <tbody>
            {report.people.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-700">{item.name}</td>
                <td className="p-4 text-green-600">R$ {item.totalRecipes.toFixed(2)}</td>
                <td className="p-4 text-red-600">R$ {item.totalExpenses.toFixed(2)}</td>
                <td className={`p-4 text-right font-bold ${item.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  R$ {item.balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}