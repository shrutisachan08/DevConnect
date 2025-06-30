const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuth = require('../middlewares/ensureAuth');

router.get('/', ensureAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser || !currentUser.techStack || currentUser.techStack.length === 0) {
      return res.status(400).json({ success: false, message: 'Incomplete profile or techStack' });
    }

    const allUsers = await User.find({
      _id: { $ne: currentUser._id },
      profileCompleted: true,
      techStack: { $exists: true, $ne: [] }
    });

    const matches = allUsers.map(user => {
      const commonSkills = user.techStack?.filter(skill =>
        currentUser.techStack.includes(skill)
      );
      const score = Math.round((commonSkills?.length || 0) / user.techStack.length * 100);

      return {
        _id: user._id, // ✅ FIXED: formerly userId
        githubUsername: user.githubUsername || '',
        username: user.username || '',
        avatar: user.avatar,
        techStack: user.techStack,
        interests: user.interests,
        goals: user.goals,
        score: score || 0
      };
    });

    const filteredMatches = matches.filter(m => m.score > 0);
    filteredMatches.sort((a, b) => b.score - a.score);

    res.json({ success: true, matches: filteredMatches });
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
