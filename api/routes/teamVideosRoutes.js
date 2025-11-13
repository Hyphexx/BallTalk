const express = require("express");
const router = express.Router();
const { getTeamVideos } = require("../controllers/teamVideosController");

router.get("/", getTeamVideos);

module.exports = router;