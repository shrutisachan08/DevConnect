const passport = require('passport');

// @desc    Authenticate with GitHub
// @route   GET /auth/github
exports.githubAuth = passport.authenticate('github', { 
  scope: ['user:email'] 
});

// @desc    GitHub callback
// @route   GET /auth/github/callback
exports.githubCallback = (req, res, next) => {
  passport.authenticate('github', { failureRedirect: '/login' })(req, res, () => {
    // Successful authentication
    res.redirect('http://localhost:3000/dashboard'); // Redirect to React app
  });
};

// @desc    Logout user
// @route   GET /auth/logout
exports.logout = (req, res, next) => { // ✅ Added 'next' parameter
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('http://localhost:3000/');
  });
};

// @desc    Get current user
// @route   GET /auth/user
exports.getUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Not authenticated' 
    });
  }
};