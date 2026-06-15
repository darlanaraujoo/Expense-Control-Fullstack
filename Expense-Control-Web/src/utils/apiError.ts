import { isAxiosError } from 'axios';

const DEFAULT_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.';

export function resolveApiError(error: unknown, fallback = DEFAULT_MESSAGE): string {
  if (!isAxiosError(error)) return fallback;

  const status = error.response?.status;
  const data = error.response?.data;

  if (typeof data === 'string' && data.trim()) return data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.trim()) return record.message;
    if (typeof record.title === 'string' && record.title.trim()) return record.title;
  }

  if (status === 409) return 'Não foi possível concluir a operação devido a um conflito de dados.';
  if (status === 400) return fallback;

  return fallback;
}
