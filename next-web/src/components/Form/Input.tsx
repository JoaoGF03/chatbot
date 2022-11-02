import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ ...rest }: Props) {
  return (
    <input
      className="bg-zinc-900 py-3 px-3 rounded text-sm placeholder:text-zinc-500"
      {...rest}
    />
  );
}
