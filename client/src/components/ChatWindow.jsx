"use client"

import { useState, useRef, useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import TypingIndicator from "./TypingIndicator"
import { Hash } from "lucide-react"

const ChatWindow = () => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const { messages, currentRoom, typingUsers, loadMessageHistory, isConnected } = useSocketContext()

  // Auto-scroll to bottom for new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load initial messages when room changes
  useEffect(() => {
    if (currentRoom) {
      setPage(1)
      setHasMore(true)
      loadMessageHistory(currentRoom, 1)
    }
  }, [currentRoom, loadMessageHistory])

  // Handle scroll for pagination
  const handleScroll = async () => {
    const container = messagesContainerRef.current
    if (container && container.scrollTop === 0 && hasMore && !loading) {
      setLoading(true)
      const prevScrollHeight = container.scrollHeight

      const nextPage = page + 1
      const moreMessages = await loadMessageHistory(currentRoom, nextPage)

      setHasMore(moreMessages)
      setPage(nextPage)

      // Maintain scroll position
      setTimeout(() => {
        container.scrollTop = container.scrollHeight - prevScrollHeight
        setLoading(false)
      }, 100)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Room header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center">
          <Hash className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">{currentRoom}</h2>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-4" onScroll={handleScroll}>
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        <MessageList messages={messages} />

        <TypingIndicator users={typingUsers} />

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t bg-white px-6 py-4">
        <MessageInput />
      </div>
    </div>
  )
}

export default ChatWindow
