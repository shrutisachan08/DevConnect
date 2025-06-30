module.exports = function ensureAdmin(req, res, next) {
  // Replace with your GitHub username or ID
  const adminUsernames = ['shrutisachan08'];

  if (req.user && adminUsernames.includes(req.user.githubUsername)) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
};
