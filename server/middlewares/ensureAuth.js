// middlewares/ensureAuth.js

module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // ✅ User is authenticated, proceed to route handler
  }

  // ❌ Not authenticated
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Please log in first.',
  });
};
