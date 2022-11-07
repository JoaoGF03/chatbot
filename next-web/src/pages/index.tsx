import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
  const { push } = useRouter();

  useEffect(() => {
    push('/Login');
  });

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-nlw-gradient bg-clip-text">
          Flow
        </h1>
        <p className="text-2xl md:text-3xl font-light text-gray-500">
          Landing Page está em construção
        </p>
      </div>
    </>
  );
}
