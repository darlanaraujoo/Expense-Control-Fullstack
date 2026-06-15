import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail, User, UserPlus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

interface FormFields {
  name: string;
  email: string;
  password: string;
  age: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  age?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) errors.name = 'Informe seu nome';
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
  const ageNum = Number(fields.age);
  if (!fields.age) {
    errors.age = 'Informe sua idade';
  } else if (ageNum <= 7) {
    errors.age = 'Idade mínima de 8 anos';
  }

  return errors;
}

function resolveSignupError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    const data = error.response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (error.response.status >= 500) return 'Serviço temporariamente indisponível.';
  }
  return 'Não foi possível criar a conta. Tente novamente.';
}

export function SignUp() {
  const navigate = useNavigate();

  const [fields, setFields] = useState<FormFields>({ name: '', email: '', password: '', age: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      await api.post('/Users', {
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
        age: Number(fields.age),
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (error) {
      setSubmitError(resolveSignupError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const inputBorder = (hasError: boolean) =>
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-200 dark:border-gray-600 focus:border-[#00BFFF] focus:ring-[#00BFFF]/20';

  const inputBase =
    'peer w-full pl-11 pr-4 pt-6 pb-2 rounded-2xl bg-slate-50/80 dark:bg-gray-900/60 border outline-none transition-all text-sm text-slate-800 dark:text-white placeholder-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 disabled:opacity-60';

  const labelBase =
    'absolute left-11 top-4 text-sm text-slate-400 dark:text-gray-500 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#00BFFF] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950 transition-colors">
      <ThemeToggle variant="floating" />

      <section className="flex-1 flex items-center justify-center p-6 sm:p-10 relative order-2 lg:order-1">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-bl from-[#00BFFF]/10 via-transparent to-[#1565C0]/10" />

        <div className="relative w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2.5 rounded-xl bg-[#00BFFF]/10 dark:bg-[#00BFFF]/20 text-[#1565C0] dark:text-[#00BFFF]">
              <UserPlus className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
              Expense Control
            </span>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-white/80 dark:border-gray-700 p-8 sm:p-10 transition-colors">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Crie sua conta
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1.5">
                Comece a organizar suas finanças hoje
              </p>
            </header>

            {submitError && (
              <div
                role="alert"
                className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
              >
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-gray-500 pointer-events-none" />
                    <input
                      id="signup-name"
                      type="text"
                      value={fields.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder=" "
                      disabled={isLoading}
                      className={`${inputBase} ${inputBorder(!!errors.name)}`}
                    />
                    <label htmlFor="signup-name" className={labelBase}>Nome</label>
                  </div>
                  {errors.name && <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <input
                      id="signup-age"
                      type="number"
                      min={8}
                      value={fields.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      placeholder=" "
                      disabled={isLoading}
                      className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/80 dark:bg-gray-900/60 border outline-none transition-all text-sm text-slate-800 dark:text-white placeholder-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-4 disabled:opacity-60 ${inputBorder(!!errors.age)}`}
                    />
                    <label
                      htmlFor="signup-age"
                      className="absolute left-4 top-4 text-sm text-slate-400 dark:text-gray-500 transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[#00BFFF] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
                    >
                      Idade
                    </label>
                  </div>
                  {errors.age && <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.age}</p>}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    value={fields.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`${inputBase} ${inputBorder(!!errors.email)}`}
                  />
                  <label htmlFor="signup-email" className={labelBase}>E-mail</label>
                </div>
                {errors.email && <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={fields.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder=" "
                    disabled={isLoading}
                    className={`${inputBase} pl-11 pr-12 ${inputBorder(!!errors.password)}`}
                  />
                  <label htmlFor="signup-password" className={labelBase}>Senha</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 ml-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00BFFF] to-[#1565C0] text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#00BFFF]/25 hover:shadow-[#00BFFF]/40 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-6">
              Já possui uma conta?{' '}
              <Link to="/login" className="font-semibold text-[#00BFFF] dark:text-[#4dd0ff] hover:underline">
                Faça Login
              </Link>
            </p>
          </div>
        </div>
      </section>

      <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-bl from-[#1565C0] via-[#1e88e5] to-[#00BFFF] order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white ml-auto text-right">
          <div className="flex items-center justify-end gap-3 mb-8">
            <span className="text-2xl font-semibold tracking-tight">Expense Control</span>
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-sm">
              <UserPlus className="w-8 h-8" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-6">
            Seu futuro financeiro
            <br />
            começa aqui.
          </h1>
          <p className="text-lg text-white/80 max-w-md ml-auto leading-relaxed">
            Cadastre-se gratuitamente e tenha controle total sobre receitas, despesas e metas.
          </p>
        </div>
      </aside>
    </div>
  );
}
