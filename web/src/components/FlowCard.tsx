import * as Dialog from '@radix-ui/react-dialog'
import { Pen } from 'phosphor-react';
import { Flow } from '../hooks/useGetFlows';

interface FlowCardProps {
  flow: Flow
  selectFlow: (flow: Flow) => void
}

export function FlowCard({ flow, selectFlow }: FlowCardProps) {
  return (
    <div key={flow.id} className="rounded-lg bg-[#2A2634] px-6 py-6 flex flex-col max-h-72 max-w-[31.5%] min-w-[31.5%]">
      <div className='flex justify-between'>
        <strong className='text-xl text-white font-black block'>
          {flow.name}
        </strong>
        <Dialog.Trigger className="text-white" onClick={() => selectFlow(flow)}>
          <Pen size={24} />
        </Dialog.Trigger>
      </div>

      <strong className='text-gray-200 font-black block my-4 overflow-auto h-auto whitespace-pre-line'>
        {flow.message.replace(/\\n/g, '\n')}
      </strong>

      <div className='flex-grow' />
      <div className='flex flex-wrap gap-2 justify-self-end mt-1'>
        {flow.buttons.map(button => (
          <div key={button.id} className='py-1 px-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3 text-sm'>
            {button.name}
          </div>
        ))}
      </div>
    </div>
  )
}
