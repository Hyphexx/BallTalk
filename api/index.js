const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());


app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/team-videos", require("./routes/teamVideosRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/reddit", require("./routes/redditRoutes"));


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running on Vercel ✅" });
});

module.exports = app;
