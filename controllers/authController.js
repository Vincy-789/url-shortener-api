const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleAuthCallback = async(req, res, done) => {
  try {
    let userDB = await User.findOne({ googleId: req.user.id });
    if (!userDB) {
      userDB = await User.create({
        googleId: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value
      });
    }
  } catch(err) {
    done(error, null);
  }
  const token = jwt.sign(
    { id: req.user.id, name: req.user.displayName, email: req.user.emails[0].value },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.redirect(process.env.FRONTEND_URL);
};

exports.logout = (req, res) => {
  req.logout();
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.getProfile = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
