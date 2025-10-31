const router = require("express").Router();
const { getNFLNews } = require("../controllers/newsmanipulator");

router.get("/:team", getNFLNews);

module.exports = router;