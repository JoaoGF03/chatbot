interface Props {
  title: string
  message: string
  buttons: {
    id: number
    name: string
  }[]
}

export default function FlowCard({ title, buttons, message }: Props) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-[#2A2634]">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-white">
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </div>
        <p className="text-gray-700 text-base h-48 overflow-y-auto whitespace-pre-line">
          {message.replace(/\\n/g, '\n')}
        </p>
      </div>
      
      <div className='flex gap-6'>
        <div className='flex flex-col gap-2'>
          <div className="justify-start flex flex-wrap gap-2">
            {
              buttons.map(button => (
                <span className="w-auto px-2 h-8 rounded bg-zinc-900">
                  {button.name}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
