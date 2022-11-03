import { useRouter } from 'next/router';
import { FormEvent, useContext } from 'react';

import { AuthContext } from '@contexts/AuthContext';

import { Input } from '@components/Form/Input';

export default function Login() {
  const { push } = useRouter();
  const { signIn, isLoading } = useContext(AuthContext);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData) as {
      email: string;
      password: string;
    };

    await signIn({ email: data.email, password: data.password });
  }

  return (
    <div className="flex flex-col mx-auto max-w-md gap-4">
      <div className="text-4xl font-black text-white">Fazer login</div>

      <div className="bg-[#2A2634] py-8 px-10 text-white rounded-lg shadow-lg shadow-black/25">
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <Input name="email" id="email" type="email" placeholder="E-mail" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Senha</label>
            <Input
              name="password"
              id="password"
              type="password"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-violet-500 px-6 h-12 rounded-md font-semibold hover:bg-violet-600 w-full sm:mt-0"
          >
            Entrar
          </button>

          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="text-gray-500 font-semibold hover:text-gray-200 underline"
              onClick={() => push('/ForgotPassword')}
            >
              Esqueci minha senha
            </button>

            <button
              type="button"
              className="text-gray-500 font-semibold hover:text-gray-200 underline"
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
