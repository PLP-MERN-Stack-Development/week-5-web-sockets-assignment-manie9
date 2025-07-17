// server.js - Main server file for Socket.io chat application

const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const fs = require("fs")

// Load environment variables
dotenv.config()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log("Created uploads directory")
}

// Initialize Express app
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage })

// In-memory storage (in production, use a database)
const users = {}
const messages = []
const rooms = { general: { name: "General", messages: [], users: [] } }
const typingUsers = {}
const privateMessages = {}

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Authentication middleware for socket
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    socket.userId = decoded.userId
    socket.username = decoded.username
    next()
  } catch (err) {
    next(new Error("Authentication error"))
  }
}

// Socket.io connection handler
io.use(authenticateSocket)

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.username} (${socket.id})`)

  // Store user info
  users[socket.id] = {
    username: socket.username,
    id: socket.id,
    userId: socket.userId,
    status: "online",
    lastSeen: new Date().toISOString(),
  }

  // Join general room by default
  socket.join("general")
  rooms.general.users.push(socket.id)

  // Emit updated user list
  io.emit("user_list", Object.values(users))
  io.emit("user_joined", { username: socket.username, id: socket.id })

  // Handle joining rooms
  socket.on("join_room", (roomName) => {
    socket.join(roomName)
    if (!rooms[roomName]) {
      rooms[roomName] = { name: roomName, messages: [], users: [] }
    }
    if (!rooms[roomName].users.includes(socket.id)) {
      rooms[roomName].users.push(socket.id)
    }
    socket.emit("room_joined", roomName)
    io.to(roomName).emit("user_joined_room", { username: socket.username, room: roomName })
  })

  // Handle leaving rooms
  socket.on("leave_room", (roomName) => {
    socket.leave(roomName)
    if (rooms[roomName]) {
      rooms[roomName].users = rooms[roomName].users.filter((id) => id !== socket.id)
    }
    io.to(roomName).emit("user_left_room", { username: socket.username, room: roomName })
  })

  // Handle chat messages
  socket.on("send_message", (messageData) => {
    const message = {
      ...messageData,
      id: Date.now() + Math.random(),
      sender: socket.username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: [socket.id],
    }

    const room = messageData.room || "general"

    if (rooms[room]) {
      rooms[room].messages.push(message)
      // Limit stored messages per room
      if (rooms[room].messages.length > 100) {
        rooms[room].messages.shift()
      }
    }

    messages.push(message)
    if (messages.length > 500) {
      messages.shift()
    }

    io.to(room).emit("receive_message", message)
  })

  // Handle message reactions
  socket.on("add_reaction", ({ messageId, reaction }) => {
    const message = messages.find((msg) => msg.id === messageId)
    if (message) {
      if (!message.reactions[reaction]) {
        message.reactions[reaction] = []
      }
      if (!message.reactions[reaction].includes(socket.username)) {
        message.reactions[reaction].push(socket.username)
        io.emit("message_reaction", { messageId, reaction, user: socket.username })
      }
    }
  })

  // Handle typing indicator
  socket.on("typing", ({ isTyping, room = "general" }) => {
    const roomTyping = typingUsers[room] || {}

    if (isTyping) {
      roomTyping[socket.id] = socket.username
    } else {
      delete roomTyping[socket.id]
    }

    typingUsers[room] = roomTyping
    socket.to(room).emit("typing_users", Object.values(roomTyping))
  })

  // Handle private messages
  socket.on("private_message", ({ to, message }) => {
    const targetUser = Object.values(users).find((user) => user.username === to)
    if (targetUser) {
      const messageData = {
        id: Date.now() + Math.random(),
        sender: socket.username,
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
        isPrivate: true,
        to: to,
      }

      // Store private message
      const conversationKey = [socket.username, to].sort().join("-")
      if (!privateMessages[conversationKey]) {
        privateMessages[conversationKey] = []
      }
      privateMessages[conversationKey].push(messageData)

      socket.to(targetUser.id).emit("private_message", messageData)
      socket.emit("private_message", messageData)
    }
  })

  // Handle message read receipts
  socket.on("mark_message_read", ({ messageId, room = "general" }) => {
    const message = messages.find((msg) => msg.id === messageId)
    if (message && !message.readBy.includes(socket.id)) {
      message.readBy.push(socket.id)
      io.to(room).emit("message_read", { messageId, readBy: socket.id })
    }
  })

  // Handle status updates
  socket.on("update_status", (status) => {
    if (users[socket.id]) {
      users[socket.id].status = status
      io.emit("user_status_update", { userId: socket.id, status })
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      const { username } = users[socket.id]
      io.emit("user_left", { username, id: socket.id })
      console.log(`${username} left the chat`)

      // Remove from all rooms
      Object.keys(rooms).forEach((roomName) => {
        if (rooms[roomName].users.includes(socket.id)) {
          rooms[roomName].users = rooms[roomName].users.filter((id) => id !== socket.id)
          io.to(roomName).emit("user_left_room", { username, room: roomName })
        }
      })
    }

    delete users[socket.id]

    // Clean up typing indicators
    Object.keys(typingUsers).forEach((room) => {
      delete typingUsers[room][socket.id]
    })

    io.emit("user_list", Object.values(users))
  })
})

// API routes
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body

  // Simple authentication (in production, use proper user management)
  if (username && password) {
    const token = jwt.sign({ userId: Date.now(), username }, JWT_SECRET, { expiresIn: "24h" })

    res.json({ token, username })
  } else {
    res.status(400).json({ error: "Username and password required" })
  }
})

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    })
  } else {
    res.status(400).json({ error: "No file uploaded" })
  }
})

app.get("/api/messages/:room?", (req, res) => {
  const room = req.params.room || "general"
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 20

  const roomMessages = rooms[room]?.messages || []
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  res.json({
    messages: roomMessages.slice(-endIndex, -startIndex || undefined).reverse(),
    hasMore: roomMessages.length > endIndex,
  })
})

app.get("/api/rooms", (req, res) => {
  const roomList = Object.keys(rooms).map((roomName) => ({
    name: roomName,
    userCount: rooms[roomName].users.length,
    messageCount: rooms[roomName].messages.length,
  }))
  res.json(roomList)
})

app.get("/api/users", (req, res) => {
  res.json(Object.values(users))
})

// Root route
app.get("/", (req, res) => {
  res.send("Socket.io Chat Server is running")
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server, io }
