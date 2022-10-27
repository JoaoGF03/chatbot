import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

interface IChatbotContext {
  qrCode: string;
  isBotConnected: boolean;
  startBot(): void;
}

export const ChatbotContext = createContext<IChatbotContext>(
  {} as IChatbotContext,
);

export function ChatbotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useRef<Socket>();
  const [isBotConnected, setIsBotConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const { user } = useContext(AuthContext)

  useEffect(() => {
    socket.current = io('http://localhost:3333', {
      autoConnect: false,
    });

    socket.current.on('connect', () => {
      console.log('🚀 socket.current.id: ', socket.current?.id);
    });

    socket.current.on('chatbot:qr', (qr: string) => {
      console.log('🚀 ~ file: ChatbotContext.tsx ~ line 43 ~ socket.current.on ~ qr', qr)
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
    if (!user) return
    
    socket.current?.connect();

    socket.current?.emit('chatbot:start', {
      id: user.id,
    });
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
