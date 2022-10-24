import ReactDOM from 'react-dom/client'
import App from './App'
import { ChatbotContextProvider } from './contexts/ChatbotContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <ChatbotContextProvider>
    <App />
  // </ChatbotContextProvider>
)
