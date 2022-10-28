import * as Dialog from '@radix-ui/react-dialog'

import { useContext, useState } from 'react'
import QRCode from 'react-qr-code';
import { ChatText, Robot } from 'phosphor-react';

import { ChatbotContext } from '../contexts/ChatbotContext';
import { FlowCard } from '../components/FlowCard';
import { CreateFlowModal } from '../components/CreateFlowModal';
import { EditFlowModal } from '../components/EditFlowModal';
import { Flow, useGetFlows } from '../hooks/useGetFlows';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';

export default function Home() {
  const [isCreateFlowModalOpen, setIsCreateFlowModalOpen] = useState(false)
  const [isEditFlowModalOpen, setIsEditFlowModalOpen] = useState(false)
  const [flow, setFlow] = useState<Flow>({} as Flow)

  const { stopBot, startBot, qrCode, isBotConnected, isBotConnecting } = useContext(ChatbotContext);
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

      <div className='self-stretch flex justify-between items-center mx-4 mt-8'>
        <h1 className='text-6xl text-white font-black'>
          Bem vindo ao <span className='text-transparent bg-nlw-gradient bg-clip-text'>Flow</span>

          <div className='text-2xl text-gray-400 font-normal mt-2'>
            Crie e gerencie seus fluxos de conversa
          </div>
        </h1>

        <div className='flex flex-col items-end'>
          <button
            className='py-3 px-6 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3'
            onClick={() => isBotConnected ? stopBot() : startBot()}
          >
            {isBotConnecting ? 'Iniciando' : isBotConnected ? 'Pausar bot' : 'Iniciar bot'}
            <Robot size={24} />
          </button>

          <button
            className='py-3 px-6 mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex items-center gap-3'
            onClick={() => setIsCreateFlowModalOpen(true)}
          >
            Criar mensagem
            <ChatText size={24} />
          </button>

          <Dialog.Root open={!!qrCode} >
            <Dialog.Overlay className='fixed inset-0 bg-black/60' />
            <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[384px] shadow-lg shadow-black/25'>
              <Dialog.Title className='text-2xl font-bold mb-4'>
                QRCode
              </Dialog.Title>
              <div className='flex flex-col items-center gap-8'>
                {qrCode
                  ? <>
                    <div className='border-4 rounded-md border-white'>
                      <QRCode value={qrCode} size={256} />
                    </div>
                    <span className='text-sm text-gray-400'>Escaneie o QRCode com o WhatsApp Web</span>
                  </>
                  : <Loading />}
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      <Dialog.Root open={isCreateFlowModalOpen} onOpenChange={setIsCreateFlowModalOpen}>
        <CreateFlowModal refetch={refetch} setOpen={setIsCreateFlowModalOpen} />
      </Dialog.Root>

      <Dialog.Root open={isEditFlowModalOpen} onOpenChange={setIsEditFlowModalOpen} >
        <div className='flex flex-wrap w-full gap-4 justify-center mt-8'>
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
