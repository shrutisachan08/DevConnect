const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ensureAuth = require('../middlewares/ensureAuth'); // or inline
const ensureAdmin = require('../middlewares/ensureadmin');
// GET /admin/users → All users data
router.get('/users', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-__v'); // exclude __v
    res.json({ success: true, users });
  } catch (err) {
    console.error('Admin fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get('/me', ensureAuth, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      user: req.user 
    });
  } catch (err) {
    console.error('Admin me route error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
// DELETE /admin/users/:id → Delete user
router.delete('/users/:id', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
