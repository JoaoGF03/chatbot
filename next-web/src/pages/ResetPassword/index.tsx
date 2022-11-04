import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';

import { api } from '@contexts/AuthContext';

import { Input } from '@components/Form/Input';

export default function ResetPassword() {
  const { query, push } = useRouter();
  const { token } = query;

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData) as {
      password: string;
    };

    try {
      await api.post(`/auth/resetPassword?token=${token}`, {
        token,
        password: data.password,
      });

      toast.success('Senha alterada com sucesso!');
      push('/Login');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    }
  }

  return (
    <div className="flex flex-col items-center mx-4 mt-12 gap-8 overflow-hidden">
      <div className="bg-[#2A2634] w-full justify-center max-w-lg py-8 px-10 text-white rounded-lg shadow-lg shadow-black/25">
        <div className="text-xl sm:text-3xl font-black">Nova senha</div>
        <div className="text-sm sm:text-base mt-2">
          Crie uma nova senha para acessar sua conta.
        </div>
        <form
          onSubmit={handleResetPassword}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Nova senha</label>
            <Input
              name="password"
              id="password"
              type="password"
              placeholder="Senha"
            />
          </div>

          <footer className="mt-4 flex justify-end gap-4">
            <button
              type="submit"
              className="bg-violet-500 px-3 h-8 sm:px-5 sm:h-12 rounded-md font-semibold hover:bg-violet-600 w-full sm:w-[35%] sm:mt-0"
            >
              Entrar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
