import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import QRCode from 'react-qr-code';
import { ChatText } from 'phosphor-react';

import './styles/main.css'
import { ChatbotContext } from './contexts/ChatbotContext';
import FlowCard from './components/FlowCard';
import { CreateFlowModal } from './components/CreateFlowModal';

export interface IFlow {
  message: string
  buttons: {
    id: number
    body: string
    flowName: string
  }[]
  id: number
  name: string
}

function App() {
  const { startBot, qrCode, isBotConnected } = useContext(ChatbotContext);
  const [flows, setFlows] = useState<IFlow[]>([])

  useEffect(() => {
    axios('http://localhost:3333/flow')
      .then(response => setFlows(response.data))
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
        <div className='pt-1 mx-8 mt-8 bg-nlw-gradient self-stretch rounded-lg overflow-hidden'>
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

      <div className="grid grid-cols-2 gap-6 mt-16">
        {
          flows.sort((a, b) => b.buttons.length - a.buttons.length).map(flow => (
            <FlowCard
              key={flow.id}
              title={flow.name}
              message={flow.message}
              buttons={flow.buttons}
            />
          ))
        }
      </div>

      {/* <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root> */}
    </div>
  )
}

export default App
