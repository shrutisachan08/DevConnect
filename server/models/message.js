const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true },
  attachments: [{ type: String }], // Optional: file URLs
  read: { type: Boolean, default: false }, // Optional: read/unread status
  timestamp: { type: Date, default: Date.now }
});

// 📌 Index for performance in querying between two users
messageSchema.index({ from: 1, to: 1, timestamp: 1 });

module.exports = mongoose.model('Message', messageSchema);
