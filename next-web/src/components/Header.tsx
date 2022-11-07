import Link from 'next/link';
import { useRouter } from 'next/router';
import { SignIn, SignOut } from 'phosphor-react';
import { useContext } from 'react';

import { AuthContext } from '@contexts/AuthContext';

export function Header() {
  const { signOut, user } = useContext(AuthContext);
  const { asPath } = useRouter();

  return (
    <header className="flex justify-between w-full">
      <div className="flex items-center gap-4 text-white">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-nlw-gradient bg-clip-text">
          <Link href="/">Flow</Link>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <button
            className="text-white hover:text-violet-500 flex gap-2 items-center text-2xl font-bold"
            onClick={signOut}
            type="button"
          >
            Sair
            <SignOut size={32} weight="bold" />
          </button>
        ) : (
          asPath !== '/Login' && (
            <Link
              href="/Login"
              className="flex gap-2 items-center text-2xl font-bold hover:text-violet-500"
            >
              Entrar
              <SignIn size={32} weight="bold" />
            </Link>
          )
        )}
      </div>
    </header>
  );
}
