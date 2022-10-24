import { io } from './app'
import { prisma } from '../prisma'
import { Buttons, Client, LocalAuth } from 'whatsapp-web.js'

io.on('connection', socket => {
  socket.on('user:login', () => {
    console.log(`${socket.id} logged in`)
  })

  socket.on('chatbot:start', async (socket) => {
    let firstMessage = false
    const createdBy: string = socket.id

    const client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
      authStrategy: new LocalAuth(),
    })

    client.initialize()

    client.on('qr', qr => {
      io.emit('chatbot:qr', qr)
    })

    client.on('ready', async () => {
      console.log('Client is ready!')
      checkInstance()
      io.emit('chatbot:ready')
    })

    client.on('message_create', async msg => {
      const chat = await msg.getChat()

      if (chat.isGroup) return

      const contact = await msg.getContact()

      if (contact.id.user === '559191777171' || contact.id.user === '5527992596466') {
        if (!firstMessage) {
          const flow = await prisma.flow.findUnique({
            where: {
              name_createdBy: {
                createdBy,
                name: 'start'
              }
            },
            include: {
              buttons: true,
            }
          })

          if (!flow) return

          const buttons = flow.buttons.map(button => {
            return {
              id: button.body,
              body: button.body,
            }
          })
          const message = flow.message.replace(/\\n/g, '\n').replace('{name}', contact.name || contact.pushname)

          console.log('🚀 ~ file: websocket.ts ~ line 73 ~ socket.on ~ message', message)

          await client.sendMessage(
            msg.from,
            flow.buttons.length > 0
              ? new Buttons(message, buttons)
              : flow.message
          )

          firstMessage = true

          setTimeout(async () => {
            firstMessage = false
          }, 1000 * 60 * 60)
          return
        }

        if (msg.type === 'buttons_response') {
          const { selectedButtonId } = msg

          if (!selectedButtonId) return

          const flow = await prisma.flow.findUnique({
            where: {
              name_createdBy: {
                createdBy,
                name: selectedButtonId
              }
            },
            include: {
              buttons: true,
            }
          })

          if (!flow) return

          const buttons = flow.buttons.map(button => {
            return {
              id: button.body,
              body: button.body,
            }
          })

          await client.sendMessage(
            msg.from,
            flow.buttons.length > 0
              ? new Buttons(flow.message.replace(/\\n/g, '\n'), buttons)
              : flow.message
          )
        }
      }
    })

    client.on('disconnected', () => {
      io.emit('chatbot:disconnected')
    })

    socket.on('disconnect', () => {
      client.destroy()
    })

    const checkInstance = async () => {
      try {
        const status = await client.getState()
        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        console.log(`🚀 ~ timestamp ${timestamp} ~ status ${status}`)
        setTimeout(checkInstance, 60000)
      } catch {
        client.initialize()
      }
    }
  })
})
