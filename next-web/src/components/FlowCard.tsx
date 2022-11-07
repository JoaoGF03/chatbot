import { Pen } from 'phosphor-react';

import { Flow } from '@hooks/useGetFlows';

interface FlowCardProps {
  flow: Flow;
  selectFlow: (flow: Flow) => void;
}

export function FlowCard({ flow, selectFlow }: FlowCardProps) {
  return (
    <div
      key={flow.id}
      className="rounded-lg bg-[#2A2634] px-6 py-6 flex flex-col max-h-72 sm:mx-0 w-full "
    >
      <div className="flex justify-between">
        <strong className="text-xl text-white font-black block">
          {flow.name.replace('Welcome', 'Bem vindo')}
        </strong>
        <div
          className="text-white hover:text-violet-500 cursor-pointer"
          onClick={() => {
            selectFlow(flow);
          }}
        >
          <Pen size={24} weight="bold" />
        </div>
      </div>

      <strong className="text-gray-200 font-black block my-4 break-words overflow-auto h-auto whitespace-pre-line">
        {flow.message.replace(/\\n/g, '\n')}
      </strong>

      <div className="flex-grow" />
      <div className="flex flex-wrap gap-2 justify-self-end mt-1">
        {flow.buttons.map(button => (
          <div
            key={button.id}
            className="pointer-events-none py-1 px-3 bg-violet-500 text-white font-bold rounded flex items-center gap-3 text-sm"
          >
            {button.name}
          </div>
        ))}
      </div>
    </div>
  );
}
