import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { resolveApiError } from '../utils/apiError';
import type { Category, User } from '../types';

export interface CategoryFormValues {
  description: string;
  purpose: string;
  userId: string;
}

interface CategoryFormModalProps {
  mode: 'create' | 'edit';
  category?: Category;
  users: User[];
  onClose: () => void;
  onSuccess: () => void;
}

const PURPOSE_TO_VALUE: Record<string, number> = {
  Recipe: 1,
  Expense: 2,
  Both: 3,
};

const emptyForm: CategoryFormValues = { description: '', purpose: '3', userId: '' };

export function CategoryFormModal({
  mode,
  category,
  users,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const [values, setValues] = useState<CategoryFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<CategoryFormValues>>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && category) {
      setValues({
        description: category.description,
        purpose: String(PURPOSE_TO_VALUE[category.purpose] ?? 3),
        userId: String(category.userId),
      });
    } else {
      setValues(emptyForm);
    }
    setErrors({});
    setSubmitError('');
  }, [mode, category]);

  const updateField = (key: keyof CategoryFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const validate = (): Partial<CategoryFormValues> => {
    const next: Partial<CategoryFormValues> = {};
    if (!values.description.trim()) next.description = 'Descrição é obrigatória';
    if (!values.userId) next.userId = 'Selecione um responsável';
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
      purpose: Number(values.purpose),
      userId: Number(values.userId),
    };

    try {
      if (mode === 'create') {
        await api.post('/Categories', payload);
      } else if (category) {
        await api.put(`/Categories/${category.id}`, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(resolveApiError(error, 'Não foi possível salvar a categoria.'));
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
          placeholder="Ex: Alimentação"
          disabled={isLoading}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Finalidade
          </label>
          <select
            value={values.purpose}
            onChange={(e) => updateField('purpose', e.target.value)}
            className={fieldClass}
            disabled={isLoading}
          >
            <option value={1}>Receita</option>
            <option value={2}>Despesa</option>
            <option value={3}>Ambas</option>
          </select>
        </div>

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
            'Criar categoria'
          ) : (
            'Salvar alterações'
          )}
        </button>
      </div>
    </form>
  );
}
