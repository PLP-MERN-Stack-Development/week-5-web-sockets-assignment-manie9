"use client"

import { useState, useRef, useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import { Send, Paperclip, Smile } from "lucide-react"
import EmojiPicker from "./EmojiPicker"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const { sendMessage, setTyping, currentRoom } = useSocketContext()

  // Handle typing indicator
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true)
      setTyping(true, currentRoom)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        setTyping(false, currentRoom)
      }
    }, 1000)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, isTyping, setTyping, currentRoom])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim() && !selectedFile) return

    let messageData = { message: message.trim(), room: currentRoom }

    // Handle file upload
    if (selectedFile) {
      try {
        const formData = new FormData()
        formData.append("file", selectedFile)

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const fileData = await response.json()
          messageData = {
            ...messageData,
            fileUrl: `http://localhost:5000${fileData.url}`,
            fileName: fileData.originalName,
            fileType: selectedFile.type,
          }
        }
      } catch (error) {
        console.error("File upload failed:", error)
      }
    }

    sendMessage(messageData.message, messageData.room)
    setMessage("")
    setSelectedFile(null)

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false)
      setTyping(false, currentRoom)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="relative">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{selectedFile.name}</span>
          </div>
          <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${currentRoom}`}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="1"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() && !selectedFile}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
      />

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  )
}

export default MessageInput
