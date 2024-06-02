const express = require("express");
const router = express.Router();
const auth = require("../routes/authRouter");
const medication = require("../routes/medicationRouter");

router.use("/", auth);
router.use("/medicine", medication);

module.exports = router;