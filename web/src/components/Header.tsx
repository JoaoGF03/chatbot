import { SignOut, WhatsappLogo } from 'phosphor-react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
  const { signOut } = useContext(AuthContext)

  return (
    <header className='flex justify-between w-full p-8'>
      <div className='flex items-center gap-4 text-white'>
        <WhatsappLogo size={32} weight="bold" />
        <h1 className='text-2xl font-bold text-white'>DTA</h1>
      </div>

      <div className='flex items-center gap-4'>
        <button className='text-white font-bold' onClick={signOut}>
          <SignOut size={32} weight="bold" />
        </button>
      </div>
    </header>
  )
}