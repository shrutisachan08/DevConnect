const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Optional: Clean existing seed users to avoid duplicates
    await User.deleteMany({ githubId: { $in: ["seed1234", "seed1235"] } });

    await User.create([
      {
        githubId: "seed1234",
        username: "devsam",
        githubUsername: "devsam",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
        techStack: ["React", "Express"],
        interests: "Open Source",
        goals: "Learn full-stack",
        profileCompleted: true
      },
      {
        githubId: "seed1235",
        username: "devmeena",
        githubUsername: "devmeena",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4",
        techStack: ["Node.js", "MongoDB"],
        interests: "Web3",
        goals: "Build DApps",
        profileCompleted: true
      }
    ]);

    console.log('✅ Dummy users inserted');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
