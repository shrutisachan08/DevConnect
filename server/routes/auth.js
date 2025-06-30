const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// @route   GET /auth/github
router.get('/github', authController.githubAuth);

// @route   GET /auth/github/callback ✅ Updated controller will handle redirection logic
router.get('/github/callback', authController.githubCallback);

// @route   GET /auth/logout
router.get('/logout', authController.logout);

// @route   GET /auth/user
router.get('/user', authController.getUser);

module.exports = router;
