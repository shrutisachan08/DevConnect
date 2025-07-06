// ✅ Imports (keep at top)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const http = require('http');
const { Server } = require('socket.io');
const generateEmbedding = require('./utils/embed');

// ✅ Route Imports
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/match');
const messageRoutes = require('./routes/messages');

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express & HTTP server
const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// ✅ Online Users Map
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ New socket connection:', socket.id);

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} registered on socket: ${socket.id}`);
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('receiveMessage', {
        from: data.from,
        message: data.message || data.text
      });
      console.log(`✉️ Message sent from ${data.from} to ${data.to}`);
    } else {
      console.log(`❌ User ${data.to} is not online`);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`🗑️ User ${userId} disconnected and removed`);
        break;
      }
    }
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });
});

// ✅ Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'devconnect_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport');

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/match', matchRoutes);
app.use('/admin', adminRoutes);
app.use('/messages', messageRoutes);

// ✅ Optional: Embedding test route
app.post('/test/embedding', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ success: false, message: 'Input required' });
    }
    const embedding = await generateEmbedding(input);
    res.json({ success: true, embedding });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Embedding error', error: err.message });
  }
});

// ✅ Health/Test routes
app.get('/', (req, res) => {
  res.send('🚀 DevConnect Backend Running');
});

app.get('/check', (req, res) => {
  res.json({
    loggedIn: !!req.user,
    user: req.user || null
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
