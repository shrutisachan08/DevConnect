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
  interests: [String],    // e.g. ['AI', 'Backend']
  goals: [String],        // e.g. ['Hackathon', 'Open Source']

  interestsVector: {
    type: [String],
    default: [],
  },

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
