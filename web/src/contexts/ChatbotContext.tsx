import { parseCookies } from 'nookies';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

interface IChatbotContext {
  qrCode: string;
  isBotConnected: boolean;
  isBotConnecting: boolean;
  startBot(): void;
  stopBot(): void;
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
  const [isBotConnecting, setIsBotConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const { user } = useContext(AuthContext)
  const { 'dta.token': token } = parseCookies();

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BASE_URL, {
      autoConnect: false,
    });

    socket.current.on('connect', () => {
      if (token) {
        socket.current?.emit('chatbot:connected',
          token,
          function (error: boolean, message: string) {
            if (error) {
              console.log('🚀 error: ', message);
            } else {
              console.log('🚀 message: ', message);
              if (message === 'Connected') {
                setIsBotConnected(true);
              } else {
                setIsBotConnected(false);
              }
            }
          }
        )
      }
    });

    socket.current.on('chatbot:qr', (qr: string) => {
      if (qr === 'expired') {
        setQrCode('')
        setIsBotConnected(false)
        setIsBotConnecting(false)
      }
      else setQrCode(qr);
    });

    socket.current.on('chatbot:ready', () => {
      setQrCode('');
      setIsBotConnected(true);
      setIsBotConnecting(false);
    });

    socket.current.on('chatbot:disconnected', () => {
      setQrCode('');
      setIsBotConnected(false);
      setIsBotConnecting(false);
    });
  }, []);

  if (user) {
    socket.current?.connect()
  }

  if (!token) {
    socket.current?.disconnect()
  }

  const startBot = () => {
    if (!user) {
      toast.info('Você precisa estar logado para usar o bot, tente recarregar a página');
      return
    }

    socket.current?.emit('chatbot:start', {
      id: user.id,
    });

    setIsBotConnecting(true);
  };

  const stopBot = () => {
    socket.current?.emit('chatbot:stop', token, function (error: boolean, message: string) {
      if (error) {
        console.log('🚀 error: ', message);
      } else {
        console.log('🚀 message: ', message);
        if (message === 'Disconnected') {
          setIsBotConnected(false);
        }
      }
    });
  };

  return (
    <ChatbotContext.Provider
      value={{
        qrCode,
        startBot,
        stopBot,
        isBotConnected,
        isBotConnecting,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}
