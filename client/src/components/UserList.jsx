"use client"

import { useState } from "react"
import { useSocketContext } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import { MessageCircle, Circle } from "lucide-react"

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const { users, sendPrivateMessage } = useSocketContext()
  const { username } = useAuth()

  const handlePrivateMessage = (targetUser) => {
    const message = prompt(`Send private message to ${targetUser}:`)
    if (message && message.trim()) {
      sendPrivateMessage(targetUser, message.trim())
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Online Users ({users.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-current" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {user.username}
                    {user.username === username && <span className="text-xs text-gray-500 ml-1">(You)</span>}
                  </p>
                  <p className="text-xs text-gray-500">{user.status || "Online"}</p>
                </div>
              </div>

              {user.username !== username && (
                <button
                  onClick={() => handlePrivateMessage(user.username)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Send private message"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserList
