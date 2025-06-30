const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  avatar: String,
  email: String,

  githubUsername: String, // shrutisachan08
  techStack: [String],    // e.g. ['React', 'Node.js']
  interests: String,
  goals: String,

  profileCompleted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
