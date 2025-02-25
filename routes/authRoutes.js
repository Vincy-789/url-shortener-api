const express = require("express");
const passport = require("passport");
const { googleAuth, googleAuthCallback, logout, getProfile } = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleAuthCallback);
router.get("/logout", logout);
router.get("/profile", getProfile);

module.exports = router;
