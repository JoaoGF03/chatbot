import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ ...rest }: Props) {
  return (
    <textarea
      className="bg-zinc-900 h-32 py-3 px-3 rounded text-sm placeholder:text-zinc-500"
      {...rest}
    />
  );
}
