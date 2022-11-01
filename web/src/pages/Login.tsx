import { FormEvent, useContext } from 'react';
import Input from '../components/Form/Input';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const { signIn, isLoading } = useContext(AuthContext);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const data = Object.fromEntries(formData) as {
      email: string
      password: string
    }

    await signIn({ email: data.email, password: data.password })
  }

  return (
    <div className='flex flex-col items-center mx-4 mt-12 gap-8 overflow-hidden'>
      <div className='text-white max-w-lg'>
        <h1 className='text-4xl font-bold'>
          Bem vindo ao <span className='text-4xl font-black text-transparent bg-nlw-gradient bg-clip-text'>
            Flow
          </span>
        </h1>
        Aqui você pode criar e gerenciar suas mensagens de forma simples e rápida.
      </div>
      <div className='bg-[#2A2634] w-full justify-center max-w-lg py-8 px-10 text-white rounded-lg shadow-lg shadow-black/25'>
        <div className='text-3xl font-black'>
          Login
        </div>
        <form onSubmit={handleSignIn} className='mt-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="email">E-mail</label>
            <Input name='email' id='email' type='email' placeholder='E-mail' />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="password">Senha</label>
            <Input name='password' id='password' type='password' placeholder='Digite sua senha' />
          </div>

          <footer className='mt-4 flex justify-end gap-4'>
            <button
              type='submit'
              disabled={isLoading}
              className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
            >
              Entrar
            </button>
          </footer>

        </form>
      </div>
    </div>
  )
}