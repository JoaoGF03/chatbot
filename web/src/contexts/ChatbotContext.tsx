import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface IChatbotContext {
  qrCode: string;
  isBotConnected: boolean;
  startBot(): void;
}

export const ChatbotContext = createContext<IChatbotContext>(
  {} as IChatbotContext,
);

export function ChatbotContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useRef<Socket>();
  const [isBotConnected, setIsBotConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    socket.current = io('http://localhost:3333', {
      forceNew: false,
    });

    socket.current.on('connect', () => {
      console.log('🚀 socket.current.id: ', socket.current?.id);
    });

    socket.current.on('chatbot:qr', (qr: string) => {
      setQrCode(qr);
    });

    socket.current.on('chatbot:ready', () => {
      console.log('🚀 ~  ready');
      setQrCode('');
      setIsBotConnected(true);
    });

    socket.current.on('chatbot:disconnected', () => {
      console.log('🚀 ~ disconnected');
      setQrCode('');
      setIsBotConnected(false);
    });
  }, []);

  const startBot = () => {
    socket.current?.emit('chatbot:start');
    console.log('🚀 ~ file: ChatbotContext.tsx ~ line 56 ~ startBot ~ socket.current', socket.current)
  };

  return (
    <ChatbotContext.Provider
      value={{
        qrCode,
        isBotConnected,
        startBot,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}
