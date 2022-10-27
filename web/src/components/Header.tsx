import { SignOut } from 'phosphor-react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
  const { signOut } = useContext(AuthContext)

  return (
    <header className='flex justify-between w-full p-4'>
      <div className='flex items-center gap-4 text-white'>
        <h1 className='text-4xl font-black '>
          DTA·
          <span className='text-transparent bg-nlw-gradient bg-clip-text'>Flow</span>
        </h1>
      </div>

      <div className='flex items-center gap-4'>
        <button className='text-white hover:text-violet-500' onClick={signOut}>
          <SignOut size={32} weight="bold" />
        </button>
      </div>
    </header>
  )
}
