"use client"

import { useState, useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import ChatSidebar from "../components/ChatSidebar"
import ChatWindow from "../components/ChatWindow"
import UserList from "../components/UserList"
import NotificationPanel from "../components/NotificationPanel"
import { Menu, X } from "lucide-react"

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userListOpen, setUserListOpen] = useState(false)
  const { isConnected, unreadCount, clearUnreadCount } = useSocketContext()
  const { username } = useAuth()

  useEffect(() => {
    // Clear unread count when chat page is focused
    const handleFocus = () => clearUnreadCount()
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [clearUnreadCount])

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <ChatSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-2 lg:ml-0">
              <h1 className="text-lg font-semibold text-gray-900">Welcome, {username}</h1>
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className={isConnected ? "text-green-600" : "text-red-600"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </div>
            )}
            <button
              onClick={() => setUserListOpen(!userListOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col">
            <ChatWindow />
          </div>

          {/* User list - Desktop */}
          <div className="hidden lg:block w-64 bg-white border-l">
            <UserList />
          </div>
        </div>
      </div>

      {/* Mobile user list */}
      {userListOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Online Users</h2>
              <button onClick={() => setUserListOpen(false)} className="p-1 rounded-md text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <UserList />
          </div>
        </div>
      )}

      <NotificationPanel />
    </div>
  )
}

export default ChatPage
