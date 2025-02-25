const express = require("express");
const router = express.Router();
const shortener = require("../controllers/shortenerController");
const redirectUrl = require("../controllers/redirectUrl");
const analytics = require("../controllers/analyticsController");


router.post("/shorten", shortener);
router.get("/shorten/:alias", redirectUrl);
router.get("/analytics/:alias", analytics);


module.exports = router;