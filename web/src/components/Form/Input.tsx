import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {

}

export default function Input({ ...rest }: Props) {
  return (
    <input
      className="bg-zinc-900 py-3 px-3 rounded text-sm placeholder:text-zinc-500"
      {...rest}
    />
  )
}
