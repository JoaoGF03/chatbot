import * as Dialog from '@radix-ui/react-dialog'

import { useContext, useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import { ChatText, Pause, SpinnerGap, Robot } from 'phosphor-react';

import { ChatbotContext } from '../contexts/ChatbotContext';
import FlowCard from '../components/FlowCard';
import { CreateFlowModal } from '../components/CreateFlowModal';
import { EditFlowModal } from '../components/EditFlowModal';
import { Flow, useGetFlows } from '../hooks/useGetFlows';
import { Header } from '../components/Header';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const [isCreateFlowModalOpen, setIsCreateFlowModalOpen] = useState(false)
  const [isEditFlowModalOpen, setIsEditFlowModalOpen] = useState(false)
  const [flow, setFlow] = useState<Flow>({} as Flow)

  const { stopBot, startBot, qrCode, isBotConnected, isBotConnecting } = useContext(ChatbotContext);
  const { user } = useContext(AuthContext)
  const { data, refetch } = useGetFlows()

  useEffect(() => {
    console.log('🚀 ~ file: Home.tsx ~ line 28 ~ useEffect ~ isBotConnected', isBotConnected)
  }, [isBotConnected])

  return (
    <div className='max-w-[1344px] mx-auto flex flex-col items-center'>
      <Header />

      <div className='self-stretch flex-wrap sm:flex justify-between items-center mx-4 mt-0'>
        <h1 className='text-3xl md:text-4xl text-white font-black'>
          Bem vindo {user?.name.split(' ')[0]}!

          <div className='text-lg md:text-xl text-gray-400 font-normal'>
            Crie e gerencie seus fluxos de conversa
          </div>
        </h1>

        <div className='flex-wrap sm:flex-col sm:flex gap-2'>
          <button
            className='py-1 sm:py-2 sm:px-4 md:py-3 md:px-6 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex justify-center gap-3 w-full sm:w-auto my-2 sm:mb-0'
            onClick={() => isBotConnected ? stopBot() : startBot()}
          >
            {isBotConnecting ? 'Iniciando' : isBotConnected ? 'Pausar bot' : 'Iniciar bot'}
            {isBotConnecting ? <SpinnerGap className='animate-spin' size={24} /> : isBotConnected ? <Pause size={24} weight='bold' /> : <Robot size={24} weight='bold' />}
          </button>

          <button
            className='py-1 sm:py-2 sm:px-4 md:py-3 md:px-6 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded flex justify-center gap-3  w-full sm:w-auto'
            onClick={() => setIsCreateFlowModalOpen(true)}
          >
            Criar mensagem
            <ChatText size={24} weight='bold' />
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
                  : <SpinnerGap className='animate-spin' size={24} />}
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      <Dialog.Root open={isCreateFlowModalOpen} onOpenChange={setIsCreateFlowModalOpen}>
        <CreateFlowModal refetch={refetch} setOpen={setIsCreateFlowModalOpen} />
      </Dialog.Root>

      <Dialog.Root open={isEditFlowModalOpen} onOpenChange={setIsEditFlowModalOpen} >
        <div className='m-4'>
          <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
            {data
              ?.sort((a) => a.name === 'Welcome' ? -1 : 1)
              .map(flow => (
                <FlowCard key={flow.id} flow={flow} selectFlow={setFlow} />
              ))}
          </div>
        </div>
        <EditFlowModal flow={flow} refetch={refetch} setOpen={setIsEditFlowModalOpen} />
      </Dialog.Root>
    </div>
  )
}
