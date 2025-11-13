// api/index.js
// ===============================
// Express backend (Vercel-compatible + local dev)
// ===============================

// Import core libs
const express = require("express");      // Express framework
const cors = require("cors");            // Cross-origin resource sharing middleware
const dotenv = require("dotenv");        // Loads .env variables into process.env

// Load environment variables from api/.env (if present)
dotenv.config();

// Create express app instance
const app = express();

// Accept JSON in request bodies (middleware)
app.use(express.json());

// Configure CORS: allow requests from any origin.
// For production tighten this to your frontend URL(s).


app.use(
  cors({
    origin: "*",        // Allow any origin temporarily
  })
);

// -------------------------------
// Route registration
// -------------------------------
// Mount your routers under /api/... so frontend hits /api/news, etc.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/team-videos", require("./routes/teamVideosRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/reddit", require("./routes/redditRoutes"));

// Health check — helpful for verifying the backend is up
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    // Message depends on NODE_ENV so dev vs prod is clear
    message:
      process.env.NODE_ENV === "production"
        ? "Backend running on Vercel ✅"
        : "Backend running locally 🧠",
  });
});

// -------------------------------
// Local dev server start
// -------------------------------
// When the file is run directly (node index.js), start listening.
// When Vercel imports this file, require.main !== module and this block won't run.
if (require.main === module) {
  const PORT = process.env.PORT || 5000; // default local port 5000
  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });
}

// Export the app for Vercel (and tests)
module.exports = app;
