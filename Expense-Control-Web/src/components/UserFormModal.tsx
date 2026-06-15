import { useEffect, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { User } from '../types';

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  age: string;
}

interface UserFormModalProps {
  mode: 'create' | 'edit';
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm: UserFormValues = { name: '', email: '', password: '', age: '' };

function validate(values: UserFormValues, mode: 'create' | 'edit'): Partial<UserFormValues> {
  const errors: Partial<UserFormValues> = {};

  if (!values.name.trim()) errors.name = 'Nome é obrigatório';

  if (!values.email.trim()) {
    errors.email = 'E-mail é obrigatório';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'E-mail inválido';
  }

  if (mode === 'create' && !values.password) {
    errors.password = 'Senha é obrigatória';
  } else if (values.password && values.password.length < 6) {
    errors.password = 'Mínimo de 6 caracteres';
  }

  const ageNum = Number(values.age);
  if (!values.age) {
    errors.age = 'Idade é obrigatória';
  } else if (ageNum <= 7) {
    errors.age = 'Idade mínima de 8 anos';
  }

  return errors;
}

function resolveError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
  }
  return 'Não foi possível salvar o usuário.';
}

export function UserFormModal({ mode, user, onClose, onSuccess }: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<UserFormValues>>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setValues({
        name: user.name,
        email: user.email,
        password: '',
        age: String(user.age),
      });
    } else {
      setValues(emptyForm);
    }
    setErrors({});
    setSubmitError('');
  }, [mode, user]);

  const updateField = (key: keyof UserFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(values, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        age: Number(values.age),
        ...(mode === 'create'
          ? { password: values.password }
          : { password: values.password || undefined }),
      };

      if (mode === 'create') {
        await api.post('/Users', payload);
      } else if (user) {
        await api.put(`/Users/${user.id}`, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(resolveError(error));
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={fieldClass}
            placeholder="Nome completo"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
            Idade
          </label>
          <input
            type="number"
            min={8}
            value={values.age}
            onChange={(e) => updateField('age', e.target.value)}
            className={fieldClass}
            placeholder="Ex: 25"
            disabled={isLoading}
          />
          {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
          E-mail
        </label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={fieldClass}
          placeholder="usuario@email.com"
          disabled={isLoading}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
          Senha {mode === 'edit' && <span className="font-normal normal-case">(opcional)</span>}
        </label>
        <input
          type="password"
          value={values.password}
          onChange={(e) => updateField('password', e.target.value)}
          className={fieldClass}
          placeholder={mode === 'edit' ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
          disabled={isLoading}
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
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
            'Criar usuário'
          ) : (
            'Salvar alterações'
          )}
        </button>
      </div>
    </form>
  );
}
