require("dotenv").config();
const express = require("express");
const passport = require("./config/passport");
const connectDB = require("./config/mongoDB");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const limiter = require("./middlewares/rateLimiteMiddleware");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const mongoose = require("mongoose");
const redis = require("redis");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

connectDB();
app.use("/api/shorten", limiter);
// const redisClient = redis.createClient();
// redisClient.connect().catch(console.error);

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
