# 🚀 Real-Time Chat Application with Socket.io

A modern, full-featured real-time chat application built with React, Node.js, Express, and Socket.io. This project demonstrates advanced real-time communication features including private messaging, file sharing, typing indicators, message reactions, and more.

## ✨ Features

### Core Chat Functionality
- ✅ Real-time messaging using Socket.io
- ✅ User authentication (JWT-based)
- ✅ Multiple chat rooms/channels
- ✅ Online/offline user status
- ✅ Message timestamps and read receipts
- ✅ Typing indicators

### Advanced Features
- ✅ Private messaging between users
- ✅ File and image sharing
- ✅ Message reactions (emoji)
- ✅ Real-time notifications
- ✅ Browser notifications
- ✅ Sound notifications
- ✅ Message pagination
- ✅ Auto-reconnection handling
- ✅ Responsive design (mobile-friendly)

### Performance & UX
- ✅ Message history loading
- ✅ Optimized Socket.io performance
- ✅ Error handling and loading states
- ✅ Smooth animations and transitions
- ✅ Emoji picker
- ✅ Unread message counter

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

\`\`\`
socketio-chat/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserList.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── MessageReactions.jsx
│   │   │   ├── EmojiPicker.jsx
│   │   │   └── NotificationPanel.jsx
│   │   ├── context/       # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── socket/        # Socket.io client
│   │   │   └── socket.js
│   │   ├── utils/         # Utility functions
│   │   │   └── dateUtils.js
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── uploads/          # File uploads directory
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env              # Environment variables
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd socketio-chat
   \`\`\`

2. **Install server dependencies**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

3. **Install client dependencies**
   \`\`\`bash
   cd ../client
   npm install
   \`\`\`

4. **Set up environment variables**
   
   Create \`.env\` file in the server directory:
   \`\`\`env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   \`\`\`
   
   Create \`.env\` file in the client directory:
   \`\`\`env
   VITE_SOCKET_URL=http://localhost:5000
   \`\`\`

5. **Create uploads directory**
   \`\`\`bash
   cd server
   mkdir uploads
   \`\`\`

### Running the Application

1. **Start the server** (from server directory):
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Start the client** (from client directory):
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser** and navigate to \`http://localhost:5173\`

## 🎯 Usage

### Authentication
- Enter any username and password to log in (demo authentication)
- The system will generate a JWT token for session management

### Chat Features
- **Join Rooms**: Click the "+" button in the sidebar to create new rooms
- **Send Messages**: Type in the message input and press Enter
- **Private Messages**: Click the message icon next to any user in the user list
- **File Sharing**: Click the paperclip icon to upload files
- **Reactions**: Click "Add reaction" below any message
- **Emoji**: Click the smile icon in the message input for emoji picker

### Notifications
- Browser notifications for new messages (permission required)
- Sound notifications (if audio file is available)
- Real-time typing indicators
- Unread message counter

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login

### File Upload
- \`POST /api/upload\` - Upload files

### Data Retrieval
- \`GET /api/messages/:room\` - Get message history for a room
- \`GET /api/rooms\` - Get list of available rooms
- \`GET /api/users\` - Get list of online users

## 🔌 Socket Events

### Client to Server
- \`user_join\` - User joins the chat
- \`send_message\` - Send a message
- \`private_message\` - Send private message
- \`typing\` - Typing indicator
- \`join_room\` - Join a chat room
- \`leave_room\` - Leave a chat room
- \`add_reaction\` - Add reaction to message
- \`mark_message_read\` - Mark message as read

### Server to Client
- \`receive_message\` - Receive new message
- \`private_message\` - Receive private message
- \`user_list\` - Updated user list
- \`user_joined\` - User joined notification
- \`user_left\` - User left notification
- \`typing_users\` - Typing users list
- \`message_reaction\` - Message reaction update
- \`message_read\` - Message read receipt

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by modifying the Tailwind classes in the components.

### Adding Features
The modular architecture makes it easy to add new features:
- Add new socket events in \`server/server.js\`
- Create new React components in \`client/src/components/\`
- Extend the socket context in \`client/src/context/SocketContext.jsx\`

## 🚀 Deployment

### Server Deployment (Railway/Render/Heroku)
1. Set environment variables in your hosting platform
2. Ensure the \`uploads\` directory is writable
3. Update CORS settings for your domain

### Client Deployment (Vercel/Netlify)
1. Build the client: \`npm run build\`
2. Deploy the \`dist\` folder
3. Update the \`VITE_SOCKET_URL\` environment variable

## 🐛 Troubleshooting

### Common Issues
1. **Connection Issues**: Check if both server and client are running
2. **CORS Errors**: Verify the CLIENT_URL in server .env matches your client URL
3. **File Upload Issues**: Ensure the uploads directory exists and is writable
4. **Notification Issues**: Check browser notification permissions

### Debug Mode
Enable debug mode by adding to your environment:
\`\`\`env
DEBUG=socket.io*
\`\`\`

## 📝 Assignment Completion

This project successfully implements all required tasks:

### ✅ Task 1: Project Setup
- Node.js server with Express ✓
- Socket.io server configuration ✓
- React front-end application ✓
- Socket.io client setup ✓
- Client-server connection ✓

### ✅ Task 2: Core Chat Functionality
- User authentication (JWT-based) ✓
- Global chat room ✓
- Message display with sender and timestamp ✓
- Typing indicators ✓
- Online/offline status ✓

### ✅ Task 3: Advanced Chat Features
- Private messaging ✓
- Multiple chat rooms ✓
- Typing indicators ✓
- File/image sharing ✓
- Read receipts ✓
- Message reactions ✓

### ✅ Task 4: Real-Time Notifications
- New message notifications ✓
- User join/leave notifications ✓
- Unread message count ✓
- Sound notifications ✓
- Browser notifications ✓

### ✅ Task 5: Performance and UX Optimization
- Message pagination ✓
- Reconnection logic ✓
- Socket.io optimization ✓
- Message delivery acknowledgment ✓
- Responsive design ✓

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
