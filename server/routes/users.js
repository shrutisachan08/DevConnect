const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuth = require('../middlewares/ensureAuth'); // ✅ Correct import, consistent casing

// ✅ GET /users/me – fetch current user profile
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      user: {
        githubUsername: user.githubUsername,
        techStack: user.techStack,
        interests: user.interests,
        goals: user.goals,
        username: user.username,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ POST /users/me – update profile
router.post('/me', ensureAuth, async (req, res) => {
  try {
    const {
      githubUsername,
      techStack,
      interests,
      goals
    } = req.body;

    if (!Array.isArray(techStack)) {
      return res.status(400).json({ success: false, message: 'techStack must be an array' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        githubUsername,
        techStack,
        interests,
        goals,
        profileCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile saved!', user: updatedUser });
  } catch (err) {
    console.error('Profile save error:', err);
    res.status(500).json({ success: false, message: 'Error saving profile' });
  }
});

module.exports = router;
