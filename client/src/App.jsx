"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <ChatPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/chat" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default App
