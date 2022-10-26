import 'react-toastify/dist/ReactToastify.css';
import { QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthContext'
import { ChatbotProvider } from './contexts/ChatbotContext'
import { Router } from './Router'
import { queryClient } from './service/query'


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer autoClose={3000} />
        {/* <ChatbotProvider> */}
        <Router />
        {/* </ChatbotProvider> */}
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
