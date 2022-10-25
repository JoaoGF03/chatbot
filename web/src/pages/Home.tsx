import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useContext(AuthContext);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    await signIn({ email, password });
  }

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <div className='p-8 bg-gray-700 border border-gray-500 rounded'>
        <strong className='text-2xl mb-6 block'>Login</strong>

        <form onSubmit={handleSignIn} className='flex flex-col gap-2 w-full'>
          <input
            className='bg-gray-900 rounded px-5 h-14'
            type="email"
            placeholder='Digite seu e-mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='bg-gray-900 rounded px-5 h-14'
            type="password"
            placeholder='Sua senha'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type='submit'
            disabled={isLoading}
            className='mt-4 bg-green-500 uppercase py-4 rounded font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50'
          >
            Garantir minha vaga
          </button>
        </form>
      </div>
    </div>
  )
}
