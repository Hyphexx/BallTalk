const express = require("express");
const router = express.Router();

// Placeholder auth routes
router.post("/register", (req, res) => {
  res.json({ msg: "Register endpoint" });
});

router.post("/login", (req, res) => {
  res.json({ msg: "Login endpoint" });
});

module.exports = router;