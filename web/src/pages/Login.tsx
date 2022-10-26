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
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
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
              Editar
            </button>
          </footer>

        </form>
      </div>
    </div>
  )
}