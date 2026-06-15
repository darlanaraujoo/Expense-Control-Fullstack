import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail, Wallet } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

interface FormFields {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.email.trim()) {
    errors.email = 'Informe seu e-mail';
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'E-mail inválido';
  }

  if (!fields.password) {
    errors.password = 'Informe sua senha';
  } else if (fields.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres';
  }

  return errors;
}

function resolveAuthError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    }

    const status = error.response.status;
    const data = error.response.data;

    if (status === 401 || status === 400) {
      if (typeof data === 'string' && data.trim()) return data;
      return 'E-mail ou senha incorretos. Tente novamente.';
    }

    if (status >= 500) {
      return 'Serviço temporariamente indisponível. Tente novamente em instantes.';
    }
  }

  return 'Não foi possível realizar o login. Tente novamente.';
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const registered = (location.state as { registered?: boolean } | null)?.registered;

  const [fields, setFields] = useState<FormFields>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setAuthError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      await login({
        email: fields.email.trim(),
        password: fields.password,
      });
      navigate('/transactions', { replace: true });
    } catch (error) {
      setAuthError(resolveAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const inputBorder = (hasError: boolean) =>
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-200 dark:border-gray-600 focus:border-[#00BFFF] focus:ring-[#00BFFF]/20';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950 transition-colors">
      <ThemeToggle variant="floating" />

      <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#00BFFF] via-[#1e88e5] to-[#1565C0]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm">
              <Wallet className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Expense Control</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
            Suas finanças,
            <br />
            sob controle.
          </h1>

          <p className="text-lg text-white/80 max-w-md leading-relaxed">
            Gerencie receitas, despesas e categorias em um só lugar — com clareza e simplicidade.
          </p>
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-[#00BFFF]/10 via-transparent to-[#1565C0]/10 dark:from-[#00BFFF]/5" />

        <div className="relative w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2.5 rounded-xl bg-[#00BFFF]/10 dark:bg-[#00BFFF]/20 text-[#1565C0] dark:text-[#00BFFF]">
              <Wallet className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
              Expense Control
            </span>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-white/80 dark:border-gray-700 p-8 sm:p-10 transition-colors">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Bem-vindo de volta
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1.5">
                Entre com suas credenciais para continuar
              </p>
            </header>

            {registered && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm">
                Conta criada com sucesso! Faça login para continuar.
              </div>
            )}

            {authError && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`peer w-full pl-11 pr-4 pt-6 pb-2 rounded-2xl bg-slate-50/80 dark:bg-gray-900/60 border outline-none transition-all text-sm text-slate-800 dark:text-white placeholder-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 disabled:opacity-60 ${inputBorder(!!errors.email)}`}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-11 top-4 text-sm text-slate-400 dark:text-gray-500 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#00BFFF] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    E-mail
                  </label>
                </div>
                {errors.email && (
                  <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={fields.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`peer w-full pl-11 pr-12 pt-6 pb-2 rounded-2xl bg-slate-50/80 dark:bg-gray-900/60 border outline-none transition-all text-sm text-slate-800 dark:text-white placeholder-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 disabled:opacity-60 ${inputBorder(!!errors.password)}`}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-11 top-4 text-sm text-slate-400 dark:text-gray-500 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#00BFFF] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00BFFF] to-[#1565C0] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#00BFFF]/25 hover:shadow-[#00BFFF]/40 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-6">
              Não tem uma conta?{' '}
              <Link
                to="/signup"
                className="font-semibold text-[#00BFFF] dark:text-[#4dd0ff] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-gray-500 mt-6">
            Expense Control &copy; {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </div>
  );
}
