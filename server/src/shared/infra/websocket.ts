import { verify } from 'jsonwebtoken';
import { Buttons, Client, LocalAuth } from 'whatsapp-web.js';

import { JWT_SECRET } from '@utils/constants';

import { io } from './app';
import { prisma } from './prisma';

const clients = new Set() as Set<{ userId: string; client: Client }>;

io.on('connection', socket => {
  socket.on('chatbot:connected', async (token, callback) => {
    const { sub: userId } = verify(token, JWT_SECRET);

    const hasClient = Array.from(clients).find(
      client => client.userId === userId,
    );

    if (hasClient) {
      const status = await hasClient.client.getState();

      if (status === 'CONNECTED') {
        callback(false, 'Connected');
      }
    } else {
      callback(true, 'No client');
    }
  });

  socket.on('chatbot:stop', async (token, callback) => {
    const { sub: userId } = verify(token, JWT_SECRET);

    const hasClient = Array.from(clients).find(
      client => client.userId === userId,
    );

    if (hasClient) {
      await hasClient.client.destroy();

      clients.delete(hasClient);

      callback(false, 'Disconnected');
    } else {
      callback(true, 'No client');
    }
  });

  socket.on('chatbot:start', async args => {
    const users = [] as { id: string; isFirstMessage: boolean }[];
    const userId: string = args.id;
    let tries = 0;

    socket.join(userId);

    const hasClient = Array.from(clients).find(
      client => client.userId === userId,
    );

    if (hasClient) {
      try {
        const status = await hasClient.client.getState();

        if (status === 'CONNECTED') {
          io.to(userId).emit('chatbot:ready');
          return;
        }
      } catch {
        return;
      }
    }

    const client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
      authStrategy: new LocalAuth({
        clientId: userId,
      }),
    });

    client.initialize().catch(async () => {
      await client.destroy();
      clients.delete(hasClient);
      io.to(userId).emit('chatbot:disconnected');
    });

    client.on('qr', qr => {
      if (tries < 3) {
        tries += 1;
        users.push({ id: userId, isFirstMessage: true });
        io.to(userId).emit('chatbot:qr', qr);
        console.log('🚀 ~ file: websocket.ts ~ line 101 ~ qr', qr);
      } else {
        tries = 0;
        io.to(userId).emit('chatbot:qr', 'expired');
        client.destroy();
      }
    });

    client.on('ready', async () => {
      console.log('Client is ready!');
      // checkInstance();
      io.to(userId).emit('chatbot:ready');
      clients.add({ userId, client });
    });

    client.on('message', async msg => {
      const chat = await msg.getChat();

      if (chat.isGroup) return;

      const contact = await msg.getContact();

      const user = users.find(user => {
        return user.id === contact.id.user;
      });

      if (!user || user.isFirstMessage) {
        // eslint-disable-next-line no-unused-expressions
        user
          ? (user.isFirstMessage = false)
          : users.push({
              id: contact.id.user,
              isFirstMessage: false,
            });

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

        setTimeout(async () => {
          const findUser = users.find(user => user.id === contact.id.user);
          findUser.isFirstMessage = true;
        }, 1000 * 60 * 60); // 1 hour

        chat.markUnread();
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

        chat.markUnread();
      }
    });

    client.on('disconnected', () => {
      io.to(userId).emit('chatbot:disconnected');
    });
  });
});
