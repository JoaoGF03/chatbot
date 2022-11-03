import * as Dialog from '@radix-ui/react-dialog';
import { ChatText, Pause, SpinnerGap, Robot } from 'phosphor-react';
import { useContext, useState } from 'react';
// import QRCode from 'react-qr-code';

import { AuthContext } from '@contexts/AuthContext';
import { ChatbotContext } from '@contexts/ChatbotContext';

import { Flow, useGetFlows } from '@hooks/useGetFlows';

import { CreateFlowModal } from '@components/CreateFlowModal';
import { EditFlowModal } from '@components/EditFlowModal';
import { FlowCard } from '@components/FlowCard';

export default function Home() {
  const [isCreateFlowModalOpen, setIsCreateFlowModalOpen] = useState(false);
  const [isEditFlowModalOpen, setIsEditFlowModalOpen] = useState(false);
  const [flow, setFlow] = useState<Flow>({} as Flow);
  const { stopBot, startBot, qrCode, isBotConnected, isBotConnecting } =
    useContext(ChatbotContext);
  const { user } = useContext(AuthContext);
  const { data, refetch } = useGetFlows();

  return (
    <>
      <div className="self-stretch flex-wrap sm:flex justify-between mb-4">
        <h1 className="text-3xl md:text-4xl text-white font-black">
          Bem vindo {user?.name.split(' ')[0]}!
          <div className="text-lg md:text-xl text-gray-400 font-normal">
            Crie e gerencie seus fluxos de conversa
          </div>
        </h1>

        <div className="flex-col flex gap-2 mt-2 sm:mt-0 text-white font-bold text-base sm:text-lg">
          <button
            className="py-1 sm:py-2 sm:px-4  bg-violet-500 hover:bg-violet-600 rounded flex justify-center items-center gap-3 w-full sm:w-auto sm:mb-0"
            onClick={() =>
              isBotConnecting || isBotConnected ? stopBot() : startBot()
            }
          >
            {isBotConnecting ? (
              <>
                Iniciando
                <SpinnerGap className="animate-spin" size={24} />
              </>
            ) : isBotConnected ? (
              <>
                Pausar bot
                <Pause size={24} weight="bold" />
              </>
            ) : (
              <>
                Iniciar bot
                <Robot size={24} weight="bold" />
              </>
            )}
          </button>

          <button
            className="py-1 sm:py-2 sm:px-4  bg-violet-500 hover:bg-violet-600 rounded flex justify-center items-center gap-3 w-full sm:w-auto sm:mb-0"
            onClick={() => setIsCreateFlowModalOpen(true)}
          >
            Criar mensagem
            <ChatText size={24} weight="bold" />
          </button>

          <Dialog.Root open={!!qrCode}>
            <Dialog.Overlay className="fixed inset-0 bg-black/60" />
            <Dialog.Content className="fixed flex flex-col gap-2 items-center bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[80%] sm:w-[384px] shadow-lg shadow-black/25">
              <Dialog.Title className="text-base sm:text-2xl font-bold">
                Escaneie o QR Code
              </Dialog.Title>

              <img className="rounded-lg" src={qrCode} alt="QR Code" />

              <div className="text-xs sm:text-base text-center text-gray-400 ">
                Abra o WhatsApp no seu celular e escaneie o QR Code acima.
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>

      <Dialog.Root
        open={isCreateFlowModalOpen}
        onOpenChange={setIsCreateFlowModalOpen}
      >
        {isCreateFlowModalOpen && (
          <CreateFlowModal
            refetch={refetch}
            setOpen={setIsCreateFlowModalOpen}
          />
        )}
      </Dialog.Root>

      <div className="grid w-full  grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data
          ?.sort((a: { name: string }) => (a.name === 'Welcome' ? -1 : 1))
          .map((flow: Flow) => (
            <FlowCard
              key={flow.id}
              flow={flow}
              selectFlow={setFlow}
              setOpen={setIsEditFlowModalOpen}
            />
          ))}
      </div>
      <Dialog.Root
        open={isEditFlowModalOpen}
        onOpenChange={setIsEditFlowModalOpen}
      >
        {isEditFlowModalOpen && (
          <EditFlowModal
            flow={flow}
            refetch={refetch}
            setOpen={setIsEditFlowModalOpen}
          />
        )}
      </Dialog.Root>
    </>
  );
}
