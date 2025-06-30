const User = require('../models/user');

exports.completeProfile = async (req, res) => {
  const { techStack, interests, goals, githubUsername } = req.body;

  if (!techStack || !githubUsername) {
    return res.status(400).json({
      success: false,
      message: 'GitHub username and tech stack are required.',
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        githubUsername,
        techStack: techStack.split(',').map((s) => s.trim()),
        interests: interests || '',
        goals: goals || '',
        profileCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
    });
  }
};
