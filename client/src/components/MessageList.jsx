"use client"
import { useSocketContext } from "../context/SocketContext"
import { useAuth } from "../context/AuthContext"
import MessageReactions from "./MessageReactions"
import { formatTime } from "../utils/dateUtils"

const MessageList = ({ messages }) => {
  const { addReaction } = useSocketContext()
  const { username } = useAuth()

  const handleReaction = (messageId, reaction) => {
    addReaction(messageId, reaction)
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.sender === username
        const showAvatar = index === 0 || messages[index - 1].sender !== message.sender

        if (message.system) {
          return (
            <div key={message.id} className="text-center">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{message.message}</span>
            </div>
          )
        }

        return (
          <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              {showAvatar && !isOwnMessage && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                  {message.sender?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Message content */}
              <div className={`${showAvatar && !isOwnMessage ? "" : "ml-11"} ${isOwnMessage ? "mr-0" : ""}`}>
                {/* Sender name and time */}
                {showAvatar && (
                  <div className={`flex items-center mb-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {isOwnMessage ? "You" : message.sender}
                    </span>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.isPrivate && <div className="text-xs opacity-75 mb-1">🔒 Private message</div>}
                  <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>

                  {/* File attachment */}
                  {message.fileUrl && (
                    <div className="mt-2">
                      {message.fileType?.startsWith("image/") ? (
                        <img
                          src={message.fileUrl || "/placeholder.svg"}
                          alt={message.fileName}
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <a
                          href={message.fileUrl}
                          download={message.fileName}
                          className="text-blue-300 hover:text-blue-100 underline text-sm"
                        >
                          📎 {message.fileName}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                <MessageReactions
                  reactions={message.reactions || {}}
                  onReaction={(reaction) => handleReaction(message.id, reaction)}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
