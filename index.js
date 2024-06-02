const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const logger = require("./utils/pino");
require("dotenv").config();

const PORT = process.env.PORT;

// passport configuration
const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
const router = require("./routes/rootRouter");
passportConfig(passport);

// server is running on PORT
const server = app.listen(PORT, () => {
  logger.info(`server is running on port: http://localhost:${PORT}`);
});

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setup static file path for css,imgs,js or other files
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")));

// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use("/", router);

app.use(express.urlencoded({ extended: true }));

