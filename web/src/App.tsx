import { AuthProvider } from './contexts/AuthContext'
import { ChatbotProvider } from './contexts/ChatbotContext'
import { Router } from './Router'

function App() {
  return (
    <AuthProvider>
      {/* <ChatbotProvider> */}
        <Router />
      {/* </ChatbotProvider> */}
    </AuthProvider>
  )
}

export default App
