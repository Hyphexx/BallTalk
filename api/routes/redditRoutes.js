const express = require("express");
const router = express.Router();
const { getTeamPosts, testRedditConnection } = require("../controllers/redditmanipulator");

// GET /api/reddit/team/:team
router.get("/team/:team", getTeamPosts);

// Test Reddit connection
router.get("/test-connection", testRedditConnection);

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Reddit API is working!",
    timestamp: new Date().toISOString(),
    using: "snoowrap"
  });
});

module.exports = router;