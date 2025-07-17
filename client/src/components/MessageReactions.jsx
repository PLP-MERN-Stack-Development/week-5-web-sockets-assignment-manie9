"use client"

import { useState } from "react"

const MessageReactions = ({ reactions, onReaction }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const commonReactions = ["👍", "❤️", "😂", "😮", "😢", "😡"]

  const hasReactions = reactions && Object.keys(reactions).length > 0

  return (
    <div className="relative mt-1">
      {hasReactions && (
        <div className="flex flex-wrap gap-1 mb-1">
          {Object.entries(reactions).map(([reaction, users]) => (
            <button
              key={reaction}
              onClick={() => onReaction(reaction)}
              className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
            >
              <span className="mr-1">{reaction}</span>
              <span className="text-gray-600">{users.length}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Add reaction
        </button>

        {showReactionPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
            <div className="flex space-x-1">
              {commonReactions.map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => {
                    onReaction(reaction)
                    setShowReactionPicker(false)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-lg transition-colors"
                >
                  {reaction}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageReactions
