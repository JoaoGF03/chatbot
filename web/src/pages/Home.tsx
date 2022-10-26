import * as Dialog from '@radix-ui/react-dialog'

import { useContext, useState } from 'react'
import QRCode from 'react-qr-code';
import { ChatText } from 'phosphor-react';

import { ChatbotContext } from '../contexts/ChatbotContext';
import { FlowCard } from '../components/FlowCard';
import { CreateFlowModal } from '../components/CreateFlowModal';
import { EditFlowModal } from '../components/EditFlowModal';
import { Flow, useGetFlows } from '../hooks/useGetFlows';
import { Header } from '../components/Header';

export default function Home() {
  const [isCreateFlowModalOpen, setIsCreateFlowModalOpen] = useState(false)
  const [isEditFlowModalOpen, setIsEditFlowModalOpen] = useState(false)
  const [flow, setFlow] = useState<Flow>({} as Flow)

  const { startBot, qrCode, isBotConnected } = useContext(ChatbotContext);
  const { isFetching, data, refetch } = useGetFlows()

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center'>
      <Header />

      <h1 className='text-6xl text-white font-black'>
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

      <Dialog.Root open={isCreateFlowModalOpen} onOpenChange={setIsCreateFlowModalOpen}>
        <div className='pt-1 mx-4 mt-8 bg-nlw-gradient self-stretch rounded-lg overflow-hidden'>
          <div className="bg-[#2A2634] px-8 py-6 flex justify-between items-center">
            <strong className='text-2xl text-white font-black block'>
              Criar novo fluxo de mensagem
            </strong>

            <Dialog.Trigger className='py-3 px-6 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3'>
              <ChatText size={24} />
              Criar mensagem
            </Dialog.Trigger>
          </div>
        </div>
        <CreateFlowModal refetch={refetch} setOpen={setIsCreateFlowModalOpen} />
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

      <Dialog.Root open={isEditFlowModalOpen} onOpenChange={setIsEditFlowModalOpen} >
        <div className='flex flex-wrap w-full gap-4 justify-center m-8'>
          {data
            ?.sort((a) => a.name === 'Welcome' ? -1 : 1)
            .map(flow => (
              <FlowCard key={flow.id} flow={flow} selectFlow={setFlow} />
            ))}
        </div>
        <EditFlowModal flow={flow} refetch={refetch} setOpen={setIsEditFlowModalOpen} />
      </Dialog.Root>
    </div>
  )
}
