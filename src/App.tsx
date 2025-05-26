import { ThemeProvider } from './components/ThemeProvider.js'
import { ChatInterface } from './components/chat/ChatInterface.js'
import './App.css'

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="switch-ai-theme">
            <div className="h-full w-full">
                <ChatInterface />
            </div>
        </ThemeProvider>
    )
}

export default App
