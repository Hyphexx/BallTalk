
const express = require("express");


const cors = require("cors");


const dotenv = require("dotenv");


dotenv.config();

const app = express();



app.use(
  cors({
    origin: [
      "https://ball-talk.vercel.app", 
      "http://localhost:3000",        
    ],
    credentials: true, 
  })
);


app.use(express.json());


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/team-videos", require("./routes/teamVideosRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/reddit", require("./routes/redditRoutes"));



app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});



app.get("/", (req, res) => {
  res.json({ message: "Welcome to BallTalk Backend API ✅" });
});



const PORT = process.env.PORT || 5000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
