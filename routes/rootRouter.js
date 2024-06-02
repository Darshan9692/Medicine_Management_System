const express = require("express");
const router = express.Router();
const auth = require("../routes/authRouter");

router.use("/", auth);

module.exports = router;