"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("chat_token"))
  const [username, setUsername] = useState(localStorage.getItem("chat_username"))

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.token)
        setUsername(data.username)
        localStorage.setItem("chat_token", data.token)
        localStorage.setItem("chat_username", data.username)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    localStorage.removeItem("chat_token")
    localStorage.removeItem("chat_username")
  }

  const value = {
    token,
    username,
    login,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
