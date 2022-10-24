import axios from 'axios'
import * as Dialog from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group'

import Input from './Form/Input';
import { FormEvent, useEffect, useState } from 'react';
import TextArea from './Form/TextArea';

export function CreateFlowModal() {
  const [games, setGames] = useState([])
  const [apiButtons, setApiButtons] = useState<{ id: string, name: string }[]>([])
  const [buttons, setButtons] = useState<string[]>([])

  useEffect(() => {
    axios('http://localhost:3333/buttons')
      .then(response => setApiButtons(response.data)).then(() => console.log('hi'))
  }, [])

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const data = Object.fromEntries(formData)

    if (!data.name) {
      return
    }

    try {
      // await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
      //   name: data.name,
      //   yearsPlaying: Number(data.yearsPlaying),
      //   discord: data.discord,
      //   hourStart: data.hourStart,
      //   hourEnd: data.hourEnd,
      //   weekDays: weekDays.map(Number),
      //   useVoiceChannel
      // })

      alert('Anúncio criado com sucesso!')
    } catch (error) {
      alert('Erro ao criar anúncio!')
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 bg-black/60' />

      <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
        <Dialog.Title className='text-3xl font-black'>
          Criei uma mensagem
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Título</label>
            <Input name='name' id='name' placeholder='Título da mensagem' />
            <p id="floating_helper_text" className="text-xs text-gray-500 dark:text-gray-400">O título será usado para criar o botão que leva para essa mensagem.</p>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Conteúdo</label>
            <TextArea name='name' id='name' placeholder='Digite sua mensagem' />
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
                {apiButtons.map((button) => (
                  <ToggleGroup.Item
                    value={button.id}
                    className={`◊w-auto px-2 h-8 rounded ${buttons.includes(button.id) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="faq">
                    {button.name}
                  </ToggleGroup.Item>
                ))}
                {/* <ToggleGroup.Item
                  value="0"
                  className={`◊w-auto px-2 h-8 rounded ${buttons.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="faq">
                  FAQ
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  className={`◊w-auto px-2 h-8 rounded ${buttons.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="ajuda">
                  Ajuda
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  className={`◊w-auto px-2 h-8 rounded ${buttons.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title="contato">
                  Contato
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  className={`◊w-auto px-2 h-8 rounded ${buttons.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                  title=" saber-mais">
                  Saber mais
                </ToggleGroup.Item> */}
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
              Criar
            </button>
          </footer>

        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
