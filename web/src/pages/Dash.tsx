import { useContext, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import QRCode from 'react-qr-code';
import { ChatText, GlobeHemisphereWest } from 'phosphor-react';

import { ChatbotContext } from '../contexts/ChatbotContext';
import FlowCard from '../components/FlowCard';
import { CreateFlowModal } from '../components/CreateFlowModal';
import { setupAPIClient } from '../service/api';

export interface IFlow {
  message: string
  buttons: {
    id: number
    name: string
  }[]
  id: number
  name: string
}

export default function Dash() {
  const { startBot, qrCode, isBotConnected } = useContext(ChatbotContext);
  const [flows, setFlows] = useState<IFlow[]>([])

  const api = setupAPIClient()

  useEffect(() => {
    api.get('/flows').then(response => setFlows(response.data))
  }, [])

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
      <h1 className='text-6xl text-white font-black mt-20'>
        Seu bot está
        {isBotConnected ? ' online' : ' offline'}
      </h1>

      {qrCode || isBotConnected ? null : (
        <button
          className="mt-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => startBot()}>
          Iniciar bot
        </button>
      )}

      <Dialog.Root>
        <div className='pt-1 mx-4 mt-8 bg-nlw-gradient self-stretch rounded-lg overflow-hidden'>
          <div className="bg-[#2A2634] px-8 py-6 flex justify-between items-center">
            <div>
              <strong className='text-2xl text-white font-black block'>Criar novo fluxo de mensagem</strong>
            </div>

            <Dialog.Trigger className='py-3 px-6 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3'>
              <ChatText size={24} />
              Criar mensagem
            </Dialog.Trigger>
          </div>
        </div>
        <CreateFlowModal />
      </Dialog.Root>

      {qrCode && (
        <div className='mt-16 w-72 h-auto p-4 bg-white flex items-center justify-center rounded-xl'>
          <QRCode
            size={256}
            value={qrCode}
            viewBox="0 0 256 256"
          />
        </div>
      )}

      <div className='flex flex-wrap w-full gap-4 justify-center mt-8'>
        {
          flows.sort((a, b) => b.buttons.length - a.buttons.length).map(flow => (
            <div key={flow.id} className="rounded-lg bg-[#2A2634] px-6 py-6 flex flex-col max-h-72 max-w-[31%] min-w-[31%]">
              <strong className='text-xl text-white font-black block'>
                {flow.name}
              </strong>

              <strong className='text-gray-200 font-black block my-4 overflow-auto h-auto whitespace-pre-line'>
                {flow.message.replace(/\\n/g, '\n')}
              </strong>

              <div className='flex-grow' />
              <div className='flex flex-wrap gap-2 justify-self-end mt-1'>
                {flow.buttons.map(button => (
                  <div key={button.name} className='py-1 px-3 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3 text-sm'>
                    {button.name}
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div >
  )
}
