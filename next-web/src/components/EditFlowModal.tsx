import * as Dialog from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { XCircle } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '@contexts/AuthContext';

import { Button, useGetButtons } from '@hooks/useGetButtons';
import { Flow } from '@hooks/useGetFlows';

import { Input } from '@components/Form/Input';
import { TextArea } from '@components/Form/TextArea';

interface EditFlowModalProps {
  flow: Flow;
  refetch: () => void;
  setOpen: (value: boolean) => void;
}

export function EditFlowModal({ flow, refetch, setOpen }: EditFlowModalProps) {
  const [buttons, setButtons] = useState<string[]>([]);
  const [render, setRender] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { data } = useGetButtons();

  useEffect(() => {
    setButtons(flow?.buttons?.map(button => button.id) || []);

    // setTimeout is used to prevent a bug where the buttons would be replaced by the new values, while the user was can see the old values
    setTimeout(() => {
      setRender(true);
    }, 10);
  }, [flow]);

  async function handleEditFlow(event: FormEvent) {
    event.preventDefault();

    const formData = Object.fromEntries(
      new FormData(event.target as HTMLFormElement),
    );

    try {
      await api.put(`/flows/${flow.id}`, {
        name: formData.name,
        message: formData.message,
        buttons: buttons.map(button => ({ id: button })),
      });

      setOpen(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao editar fluxo');
    }
  }

  async function handleDeleteFlow() {
    try {
      await api.delete(`/flows/${flow.id}`);

      setOpen(false);
      setDeleteDialog(false);
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar fluxo');
    }
  }

  return render ? (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/60" />

      <Dialog.Content
        onCloseAutoFocus={e => {
          e.preventDefault();
          setRender(false);
          setButtons(flow?.buttons?.map(button => button.id) || []);
        }}
        className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[90%] sm:w-[480px] shadow-lg shadow-black/25"
      >
        <Dialog.Title className="text-2xl sm:text-3xl font-black">
          Editar mensagem
        </Dialog.Title>

        <Dialog.Close
          type="button"
          className="fixed text-white rounded-lg top-4 right-4 p-2 hover:text-violet-500"
        >
          <XCircle size={32} weight="bold" />
        </Dialog.Close>

        <form
          onSubmit={handleEditFlow}
          className="mt-4 flex flex-col gap-2 sm:gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-sm sm:text-lg">
              Título
            </label>
            <Input
              name="name"
              id="name"
              placeholder="Título da mensagem"
              disabled={flow.name === 'Welcome'}
              defaultValue={flow.name?.replace('Welcome', 'Bem vindo')}
            />
            <p
              id="floating_helper_text"
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              O título será usado para criar o botão que leva para essa
              mensagem.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-bold text-sm sm:text-lg">
              Conteúdo
            </label>
            <TextArea
              name="message"
              id="message"
              placeholder="Digite sua mensagem"
              defaultValue={flow.message}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="weekDays"
                className="font-bold text-sm sm:text-lg"
              >
                Botões
              </label>

              <ToggleGroup.Root
                type="multiple"
                className="justify-start flex flex-wrap gap-2"
                value={buttons}
                onValueChange={value => {
                  if (buttons.length < 3 || value.length < buttons.length) {
                    setButtons(value);
                  }
                }}
              >
                {data
                  ?.filter((button: Button) => button.name !== flow.name)
                  .map((button: Button) => (
                    <ToggleGroup.Item
                      key={button.id}
                      value={button.id}
                      className={`w-auto px-2 h-6 sm:h-8 text-sm sm:text-base rounded ${
                        buttons.includes(button.id)
                          ? 'bg-violet-500'
                          : 'bg-zinc-900'
                      }`}
                      title="faq"
                    >
                      {button.name}
                    </ToggleGroup.Item>
                  ))}
              </ToggleGroup.Root>
            </div>
          </div>

          <footer className="flex-wrap sm:flex justify-between">
            {flow.name === 'Welcome' ? (
              <span />
            ) : (
              <button
                type="button"
                className="bg-red-500 h-8 sm:px-5 sm:h-12 rounded-md font-semibold hover:bg-red-600 w-full sm:w-[35%] sm:mt-0"
                onClick={() => setDeleteDialog(true)}
              >
                Deletar
              </button>
            )}
            <button
              type="submit"
              className="bg-violet-500 h-8 sm:px-5 sm:h-12 rounded-md font-semibold hover:bg-violet-600 w-full sm:w-[35%] mt-2 sm:mt-0"
            >
              Editar
            </button>
          </footer>
        </form>
      </Dialog.Content>

      <Dialog.Root open={deleteDialog} onOpenChange={setDeleteDialog}>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content
          onCloseAutoFocus={e => e.preventDefault()}
          className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[70%] sm:w-[400px] shadow-lg shadow-black/25"
        >
          <Dialog.Title className="text-3xl font-black">
            Deletar fluxo
          </Dialog.Title>

          <p className="mt-8 text-lg">
            Tem certeza que deseja deletar esse fluxo?
          </p>

          <footer className="mt-4 flex-wrap justify-between sm:flex">
            <button
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600 w-full sm:w-auto"
              onClick={() => setDeleteDialog(false)}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="bg-red-500 px-5 h-12 rounded-md font-semibold hover:bg-red-600 w-full sm:w-auto mt-4 sm:mt-0"
              onClick={handleDeleteFlow}
            >
              Deletar
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Root>
    </Dialog.Portal>
  ) : (
    <span />
  );
}
