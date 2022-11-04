import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';

import { api } from '@contexts/AuthContext';

import { Input } from '@components/Form/Input';

export default function ForgotPassword() {
  const { push } = useRouter();

  async function handleForgotPassword(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData) as {
      email: string;
    };

    try {
      await api.post('/auth/forgotPassword', {
        email: data.email,
      });

      toast.success(
        'Email enviado com sucesso! Verifique sua caixa de entrada ou spam.',
      );
      push('/Login');
    } catch (error) {
      toast.error('Erro ao enviar email');
    }
  }

  return (
    <div className="flex flex-col items-center mx-4 mt-12 gap-8 overflow-hidden">
      <div className="bg-[#2A2634] w-full justify-center max-w-lg py-8 px-10 text-white rounded-lg shadow-lg shadow-black/25">
        <div className="text-xl sm:text-3xl font-black">
          Esqueci minha senha
        </div>
        <div className="text-sm sm:text-base mt-2">
          Será enviado um e-mail para você com um link para criar uma nova
          senha.
        </div>
        <form
          onSubmit={handleForgotPassword}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email">E-mail</label>
            <Input name="email" id="email" type="email" placeholder="E-mail" />
          </div>

          <footer className="mt-4 flex justify-end gap-4">
            <button
              type="submit"
              className="bg-violet-500 px-3 h-8 sm:px-5 sm:h-12 rounded-md font-semibold hover:bg-violet-600 w-full sm:w-[35%] sm:mt-0"
            >
              Enviar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
