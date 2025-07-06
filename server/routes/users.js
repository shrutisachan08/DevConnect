const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuth = require('../middlewares/ensureAuth');
const generateEmbeddingFromText = require('../utils/embed'); // Embedding function

// ✅ Cosine similarity function
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// ✅ GET /users/me → Fetch current user profile
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

// ✅ POST /users/me → Update user profile and generate embedding
router.post('/me', ensureAuth, async (req, res) => {
  try {
    const { githubUsername, techStack, interests, goals } = req.body;

    if (!Array.isArray(techStack)) {
      return res.status(400).json({ success: false, message: 'techStack must be an array' });
    }

    const interestsVector = Array.from(new Set([...(techStack || []), ...(interests || []), ...(goals || [])]));
    const inputText = interestsVector.join(', ');

    const embedding = await generateEmbeddingFromText(inputText); // 🔥 AI call

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        githubUsername,
        techStack,
        interests,
        goals,
        profileCompleted: true,
        interestsVector,
        embedding
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

// ✅ GET /users/recommend/suggest → AI-based collaborator recommendations
router.get('/recommend/suggest', ensureAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser?.embedding?.length) {
      return res.status(400).json({ success: false, message: 'Complete your profile to get AI recommendations.' });
    }

    const allUsers = await User.find({
      _id: { $ne: req.user._id },
      profileCompleted: true,
      embedding: { $exists: true, $ne: [] }
    });

    const scored = allUsers.map((user) => ({
      user,
      score: cosineSimilarity(currentUser.embedding, user.embedding),
    }));

    const topMatches = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => ({
        _id: s.user._id,
        username: s.user.username,
        githubUsername: s.user.githubUsername,
        techStack: s.user.techStack,
        interests: s.user.interests,
        goals: s.user.goals,
        similarity: s.score.toFixed(3)
      }));

    res.json({
      success: true,
      recommendations: topMatches
    });
  } catch (err) {
    console.error('❌ Error suggesting collaborators:', err);
    res.status(500).json({ success: false, message: 'Error generating AI suggestions.' });
  }
});

module.exports = router;
