import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { resolveApiError } from '../utils/apiError';
import type { Category, Transaction, User } from '../types';

export interface TransactionFormValues {
  description: string;
  value: string;
  type: string;
  userId: string;
  categoryId: string;
}

interface TransactionFormModalProps {
  mode: 'create' | 'edit';
  transaction?: Transaction;
  users: User[];
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

const TYPE_TO_VALUE: Record<string, number> = {
  Recipe: 1,
  Expense: 2,
};

const emptyForm: TransactionFormValues = {
  description: '',
  value: '',
  type: '2',
  userId: '',
  categoryId: '',
};

export function TransactionFormModal({
  mode,
  transaction,
  users,
  categories,
  onClose,
  onSuccess,
}: TransactionFormModalProps) {
  const [values, setValues] = useState<TransactionFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<TransactionFormValues>>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && transaction) {
      setValues({
        description: transaction.description,
        value: String(transaction.value),
        type: String(TYPE_TO_VALUE[transaction.type] ?? 2),
        userId: String(transaction.userId),
        categoryId: String(transaction.categoryId),
      });
    } else {
      setValues(emptyForm);
    }
    setErrors({});
    setSubmitError('');
  }, [mode, transaction]);

  const updateField = (key: keyof TransactionFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const validate = (): Partial<TransactionFormValues> => {
    const next: Partial<TransactionFormValues> = {};
    if (!values.description.trim()) next.description = 'Descrição é obrigatória';
    if (!values.value || Number(values.value) <= 0) next.value = 'Informe um valor válido';
    if (!values.userId) next.userId = 'Selecione um responsável';
    if (!values.categoryId) next.categoryId = 'Selecione uma categoria';
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    const payload = {
      description: values.description.trim(),
      value: Number(values.value),
      type: Number(values.type),
      userId: Number(values.userId),
      categoryId: Number(values.categoryId),
    };

    try {
      if (mode === 'create') {
        await api.post('/Transactions', payload);
      } else if (transaction) {
        await api.put(`/Transactions/${transaction.id}`, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(resolveApiError(error, 'Não foi possível salvar a transação.'));
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {submitError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
          Descrição
        </label>
        <input
          type="text"
          value={values.description}
          onChange={(e) => updateField('description', e.target.value)}
          className={fieldClass}
          placeholder="Ex: Aluguel, Salário..."
          disabled={isLoading}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Valor (R$)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={values.value}
            onChange={(e) => updateField('value', e.target.value)}
            className={fieldClass}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Tipo
          </label>
          <select
            value={values.type}
            onChange={(e) => updateField('type', e.target.value)}
            className={fieldClass}
            disabled={isLoading}
          >
            <option value={1}>Receita</option>
            <option value={2}>Despesa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Responsável
          </label>
          <select
            value={values.userId}
            onChange={(e) => updateField('userId', e.target.value)}
            className={fieldClass}
            disabled={isLoading}
          >
            <option value="">Selecione...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Categoria
          </label>
          <select
            value={values.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            className={fieldClass}
            disabled={isLoading}
          >
            <option value="">Selecione...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.description}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#00BFFF] dark:hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : mode === 'create' ? (
            'Criar transação'
          ) : (
            'Salvar alterações'
          )}
        </button>
      </div>
    </form>
  );
}
