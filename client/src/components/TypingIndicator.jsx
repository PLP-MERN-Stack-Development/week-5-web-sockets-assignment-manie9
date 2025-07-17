const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing...`
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing...`
    } else {
      return `${users.length} people are typing...`
    }
  }

  return (
    <div className="flex items-center text-sm text-gray-500 mt-2">
      <div className="flex space-x-1 mr-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  )
}

export default TypingIndicator
