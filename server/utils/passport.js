const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/auth/github/callback",
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (user) {
      return done(null, user);
    }

    const email = profile.emails?.[0]?.value || null;
    const avatar = profile.photos?.[0]?.value || null;

    user = await User.create({
      githubId: profile.id,
      username: profile.username,
      displayName: profile.displayName || profile.username,
      email: email,
      avatar: avatar,
      bio: profile._json.bio || '',
      location: profile._json.location || '',
      publicRepos: profile._json.public_repos || 0,
      followers: profile._json.followers || 0,
      following: profile._json.following || 0
    });

    return done(null, user);
  } catch (error) {
    console.error("❌ GitHub Strategy Error:", error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
