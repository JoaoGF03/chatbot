import * as Dialog from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group'

import { toast } from 'react-toastify';
import { FormEvent, useEffect, useState } from 'react';
import Input from './Form/Input';
import TextArea from './Form/TextArea';
import { useGetButtons } from '../hooks/useGetButtons';
import { Flow } from '../hooks/useGetFlows';
import { api } from '../contexts/AuthContext';

interface EditFlowModalProps {
  flow: Flow
  refetch: () => void
  setOpen: (value: boolean) => void
}

export function EditFlowModal({ flow, refetch, setOpen }: EditFlowModalProps) {
  const [buttons, setButtons] = useState<string[]>([])
  const { data } = useGetButtons()

  useEffect(() => {
    setButtons(flow?.buttons?.map(button => button.id) || [])
  }, [flow])

  async function handleEditFlow(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const data = Object.fromEntries(formData)

    try {
      await api.put(`/flows/${flow.id}`, {
        name: data.name,
        message: data.message,
        buttons: buttons.map(button => ({ id: button }))
      })

      refetch()
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao editar fluxo')
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-black/60' />

      <Dialog.Content onCloseAutoFocus={e => e.preventDefault()} className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
        <Dialog.Title className='text-3xl font-black'>
          Edite sua mensagem
        </Dialog.Title>

        <form onSubmit={handleEditFlow} className='mt-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Título</label>
            <Input name='name' id='name' placeholder='Título da mensagem' disabled={flow.name === 'Welcome'} defaultValue={flow.name} />
            <p id="floating_helper_text" className="text-xs text-gray-500 dark:text-gray-400">O título será usado para criar o botão que leva para essa mensagem.</p>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="message">Conteúdo</label>
            <TextArea name='message' id='message' placeholder='Digite sua mensagem' defaultValue={flow.message} />
          </div>

          <div className='flex gap-6'>
            <div className='flex flex-col gap-2'>
              <label htmlFor="weekDays">Botões</label>

              <ToggleGroup.Root
                type='multiple'
                className='justify-start flex flex-wrap gap-2'
                value={buttons}
                onValueChange={(value) => {
                  if (buttons.length < 3 || value.length < buttons.length)
                    setButtons(value)
                }}
              >
                {data?.map((button) => (
                  <ToggleGroup.Item
                    key={button.id}
                    value={button.id}
                    className={`w-auto px-2 h-8 rounded ${buttons.includes(button.id) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="faq">
                    {button.name}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </div>
          </div>

          <footer className='mt-4 flex justify-end gap-4'>
            <Dialog.Close
              type='button'
              className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
            >
              Cancelar
            </Dialog.Close>

            <button
              type='submit'
              className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
            >
              Editar
            </button>
          </footer>

        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
