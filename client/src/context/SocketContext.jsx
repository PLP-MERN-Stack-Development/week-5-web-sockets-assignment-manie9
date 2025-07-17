"use client"

import { createContext, useContext, useEffect } from "react"
import { useSocket } from "../socket/socket"
import { useAuth } from "./AuthContext"

const SocketContext = createContext()

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const { token } = useAuth()
  const socketData = useSocket()

  useEffect(() => {
    if (token) {
      socketData.connect(token)
    }

    return () => {
      socketData.disconnect()
    }
  }, [token])

  return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>
}
