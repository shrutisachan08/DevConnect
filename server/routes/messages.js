console.log('✅ Messages routes file loaded');

const express = require('express');
const router = express.Router();
const ensureAuth = require('../middlewares/ensureAuth');
const Message = require('../models/message');

// 🔍 Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log(`🔍 Params:`, req.params);
  console.log(`🔍 Body:`, req.body);
  console.log('-------------------------');
  next();
});

// 🧪 Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Messages route working',
    time: new Date().toISOString()
  });
});

// ✅ POST /messages/send - Send a new message
router.post('/send', ensureAuth, async (req, res) => {
  const { to, message, attachments } = req.body;

  if (!to || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Recipient and non-empty message are required.'
    });
  }

  try {
    const newMsg = await Message.create({
      from: req.user._id,
      to,
      message: message.trim(),
      attachments: attachments || [],
      timestamp: new Date()
    });

    console.log(`✅ Message from ${req.user._id} to ${to} saved: ${newMsg._id}`);

    res.json({ success: true, message: newMsg });
  } catch (err) {
    console.error('❌ Error saving message:', err);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// ✅ GET /messages/chat/:userId - Fetch chat history
router.get('/chat/:userId', ensureAuth, async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user._id;

  if (!userId || userId === 'undefined') {
    return res.status(400).json({
      success: false,
      message: 'Valid user ID is required.'
    });
  }

  try {
    const messages = await Message.find({
      $or: [
        { from: currentUser, to: userId },
        { from: userId, to: currentUser }
      ]
    })
    .sort({ timestamp: 1 })
    .select('-__v');

    res.json({
      success: true,
      messages,
      currentUserId: currentUser
    });
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ success: false, message: 'Failed to load messages.' });
  }
});

module.exports = router;
