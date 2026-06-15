import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { UserReportResponse } from '../types';

export function Reports() {
  const [report, setReport] = useState<UserReportResponse | null>(null);

  useEffect(() => {
    api
      .get<UserReportResponse>('/Users/report')
      .then((response) => setReport(response.data))
      .catch((err) => console.error('Erro ao carregar relatório:', err));
  }, []);

  if (!report) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">A carregar relatórios...</div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-center text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">
        Relatório Geral de Gastos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-8">
        <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-800 transition-colors">
          <p className="text-green-600 dark:text-green-400 font-bold uppercase text-xs">Total Receitas</p>
          <p className="text-2xl font-black text-green-700 dark:text-green-300">
            R$ {report.generalTotalRecipes.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-colors">
          <p className="text-red-600 dark:text-red-400 font-bold uppercase text-xs">Total Despesas</p>
          <p className="text-2xl font-black text-red-700 dark:text-red-300">
            R$ {report.generalTotalExpenses.toFixed(2)}
          </p>
        </div>
        <div
          className={`p-6 rounded-lg border transition-colors ${
            report.generalNetBalance >= 0
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
              : 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
          }`}
        >
          <p className="font-bold uppercase text-xs text-gray-700 dark:text-gray-300">Saldo Líquido</p>
          <p
            className={`text-2xl font-black ${report.generalNetBalance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}
          >
            R$ {report.generalNetBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-transparent dark:border-gray-700 transition-colors">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 text-left text-gray-700 dark:text-gray-300">
              <th className="p-4">Usuário</th>
              <th className="p-4">Receitas</th>
              <th className="p-4">Despesas</th>
              <th className="p-4 text-right">Saldo Individual</th>
            </tr>
          </thead>
          <tbody>
            {report.people.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4 font-bold text-gray-700 dark:text-gray-200">{item.name}</td>
                <td className="p-4 text-green-600 dark:text-green-400">
                  R$ {item.totalRecipes.toFixed(2)}
                </td>
                <td className="p-4 text-red-600 dark:text-red-400">
                  R$ {item.totalExpenses.toFixed(2)}
                </td>
                <td
                  className={`p-4 text-right font-bold ${item.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}
                >
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
