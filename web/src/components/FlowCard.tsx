interface Props {
  title: string
  message: string
  buttons: {
    id: number
    body: string
    flowName: string
  }[]
}

export default function FlowCard({ title, buttons, message }: Props) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title.charAt(0).toUpperCase() + title.slice(1)}</div>
        <p className="text-gray-700 text-base h-48 overflow-y-auto whitespace-pre-line">
          {
            message.replace(/\\n/g, '\n')
          }
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {
          buttons.map(button => (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {button.body}
            </span>
          ))
        }
      </div>
    </div>
  )
}
