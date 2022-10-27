import { Buttons, Client, LocalAuth } from 'whatsapp-web.js';

import { io } from './app';
import { prisma } from './prisma';

io.on('connection', socket => {
  socket.on('user:login', () => {
    console.log(`${socket.id} logged in`);
  });

  socket.on('chatbot:start', async args => {
    console.log('🚀 ~ file: websocket.ts ~ line 155 ~ args', args)
    let firstMessage = false;
    let users = []
    const userId: string = args.id;

    socket.join(userId);

    const client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
      authStrategy: new LocalAuth({
        clientId: userId,
      }),
    });

    const checkInstance = async () => {
      try {
        const status = await client.getState();
        const timestamp = new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
        });
        console.log(`🚀 ~ timestamp ${timestamp} ~ status ${status}`);
        setTimeout(checkInstance, 60000);
      } catch {
        io.to(userId).emit('chatbot:disconnected');
      }
    };

    client.initialize();

    client.on('qr', qr => {
      console.log('🚀 ~ file: websocket.ts ~ line 46 ~ qr', qr)
      io.to(userId).emit('chatbot:qr', qr);
    });

    client.on('ready', async () => {
      console.log('Client is ready!');
      checkInstance();
      io.to(userId).emit('chatbot:ready');
    });

    client.on('message_create', async msg => {

      const chat = await msg.getChat();

      if (chat.isGroup) return;

      const contact = await msg.getContact();

      if (
        contact.id.user === '5527992596466' || contact.id.user === '5527999768155' || contact.id.user === '5527992818789'
      ) {
        const user = users.find(user => user.id === contact.id.user)

        if (!user) users.push({
          id: contact.id.user,
          isFirstMessage: false
        })

        if (!user || user?.isFirstMessage) {
          const flow = await prisma.flow.findUnique({
            where: {
              name_createdBy: {
                name: 'Welcome',
                userId,
              },
            },
            include: {
              buttons: true,
            },
          });

          if (!flow) return;

          const buttons = flow.buttons.map(button => {
            return {
              id: button.name,
              body: button.name,
            };
          });
          const message = flow.message
            .replace(/\\n/g, '\n')
            .replace('{name}', contact.name || contact.pushname);


          await client.sendMessage(
            msg.from,
            flow.buttons.length > 0
              ? new Buttons(message, buttons)
              : flow.message,
          );

          firstMessage = true;

          setTimeout(async () => {
            firstMessage = false;
          }, 1000 * 60 * 60);
          return;
        }

        if (msg.type === 'buttons_response') {
          const { selectedButtonId } = msg;

          if (!selectedButtonId) return;

          const flow = await prisma.flow.findUnique({
            where: {
              name_createdBy: {
                userId,
                name: selectedButtonId,
              },
            },
            include: {
              buttons: true,
            },
          });

          if (!flow) return;

          const buttons = flow.buttons.map(button => {
            return {
              id: button.name,
              body: button.name,
            };
          });

          await client.sendMessage(
            msg.from,
            flow.buttons.length > 0
              ? new Buttons(flow.message.replace(/\\n/g, '\n'), buttons)
              : flow.message,
          );
        }
      }
    });

    client.on('disconnected', () => {
      io.to(userId).emit('chatbot:disconnected');
    });

    socket.on('disconnect', () => {
      client.destroy();
    });
  });
});
