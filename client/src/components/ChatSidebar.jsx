"use client"

import React, { useState } from "react"
import { useSocketContext } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import { Hash, Plus, Settings, LogOut, MessageCircle, X } from "lucide-react"
import SettingsModal from "./SettingsModal"

const ChatSidebar = ({ onClose }) => {
  const [newRoomName, setNewRoomName] = useState("")
  const [showNewRoomInput, setShowNewRoomInput] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { rooms, currentRoom, joinRoom, setCurrentRoom } = useSocketContext()
  const { logout, username } = useAuth()

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (newRoomName.trim()) {
      joinRoom(newRoomName.trim())
      setNewRoomName("")
      setShowNewRoomInput(false)
    }
  }

  const handleRoomSelect = (roomName) => {
    setCurrentRoom(roomName)
    if (onClose) onClose()
  }

  return (
    <>
      <div className="h-full flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="font-bold text-lg">ChatApp</h2>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{username}</p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Channels</h3>
              <button
                onClick={() => setShowNewRoomInput(true)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {showNewRoomInput && (
              <form onSubmit={handleCreateRoom} className="mb-3">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex mt-2 space-x-2">
                  <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewRoomInput(false)
                      setNewRoomName("")
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => handleRoomSelect(room)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-left transition-colors ${
                    currentRoom === room ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  <span className="truncate">{room}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}

export default ChatSidebar
