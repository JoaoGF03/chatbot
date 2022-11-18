"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const constants_1 = require("../../utils/constants");
const app_1 = require("./app");
const prisma_1 = require("./prisma");
const clients = new Set();
app_1.io.on('connection', socket => {
    socket.on('chatbot:connected', (token, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub: userId } = (0, jsonwebtoken_1.verify)(token, constants_1.JWT_SECRET);
            if (userId) {
                if (typeof userId === 'string')
                    socket.join(userId);
                else
                    socket.join(userId.toString());
            }
            const hasClient = Array.from(clients).find(client => client.userId === userId);
            if (hasClient) {
                const status = yield hasClient.client.getState();
                if (status === 'CONNECTED') {
                    callback(false, 'Connected');
                }
            }
            else {
                callback(true, 'No client');
            }
        }
        catch (err) {
            callback(true, 'Invalid token');
        }
    }));
    socket.on('chatbot:stop', (token) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub: userId } = (0, jsonwebtoken_1.verify)(token, constants_1.JWT_SECRET);
        const hasClient = Array.from(clients).find(client => client.userId === userId);
        if (hasClient) {
            yield hasClient.client.destroy();
            clients.delete(hasClient);
        }
        if (typeof userId === 'string')
            app_1.io.to(userId).emit('chatbot:disconnected');
        else
            app_1.io.to(userId.toString()).emit('chatbot:disconnected');
    }));
    socket.on('chatbot:start', (args) => __awaiter(void 0, void 0, void 0, function* () {
        const users = [];
        const userId = args.id;
        let tries = 0;
        socket.join(userId);
        const hasClient = Array.from(clients).find(client => client.userId === userId);
        if (hasClient) {
            try {
                const status = yield hasClient.client.getState();
                if (status === 'CONNECTED') {
                    app_1.io.to(userId).emit('chatbot:ready');
                    return;
                }
            }
            catch (_a) {
                return;
            }
        }
        const client = new whatsapp_web_js_1.Client({
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
            authStrategy: new whatsapp_web_js_1.LocalAuth({
                clientId: userId,
            }),
        });
        client.initialize().catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(error);
            yield client.destroy().catch(() => {
                app_1.io.to(userId).emit('chatbot:disconnected');
            });
            // clients.delete(hasClient);
            app_1.io.to(userId).emit('chatbot:disconnected');
        }));
        client.on('qr', qr => {
            if (tries < 3) {
                tries += 1;
                users.push({ id: userId, isFirstMessage: true });
                app_1.io.to(userId).emit('chatbot:qr', qr);
                console.log('🚀 ~ file: websocket.ts ~ line 101 ~ qr', qr);
            }
            else {
                tries = 0;
                app_1.io.to(userId).emit('chatbot:qr', 'expired');
                client.destroy();
            }
        });
        client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Client is ready!');
            app_1.io.to(userId).emit('chatbot:ready');
            clients.add({ userId, client });
        }));
        client.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const chat = yield msg.getChat();
            if (chat.isGroup)
                return;
            const contact = yield msg.getContact();
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
                const flow = yield prisma_1.prisma.flow.findUnique({
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
                if (!flow)
                    return;
                const buttons = flow.buttons.map(button => {
                    return {
                        id: button.name,
                        body: button.name,
                    };
                });
                const message = flow.message
                    .replace(/\\n/g, '\n')
                    .replace('{name}', contact.name || contact.pushname);
                yield client.sendMessage(msg.from, flow.buttons.length > 0
                    ? new whatsapp_web_js_1.Buttons(message, buttons)
                    : flow.message);
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    const findUser = users.find(user => user.id === contact.id.user);
                    findUser.isFirstMessage = true;
                }), 1000 * 60 * 60); // 1 hour
                chat.markUnread();
                return;
            }
            if (msg.type === 'buttons_response') {
                const { selectedButtonId } = msg;
                if (!selectedButtonId)
                    return;
                const flow = yield prisma_1.prisma.flow.findUnique({
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
                if (!flow)
                    return;
                const buttons = flow.buttons.map(button => {
                    return {
                        id: button.name,
                        body: button.name,
                    };
                });
                yield client.sendMessage(msg.from, flow.buttons.length > 0
                    ? new whatsapp_web_js_1.Buttons(flow.message.replace(/\\n/g, '\n'), buttons)
                    : flow.message);
                chat.markUnread();
            }
        }));
        client.on('disconnected', () => {
            app_1.io.to(userId).emit('chatbot:disconnected');
        });
    }));
});
