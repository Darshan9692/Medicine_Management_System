const express = require("express");
const { addMedications, updateMedications, deleteMedications, getMedications, getMedication, markDone } = require("../controllers/medicationController");
const passport = require("passport");
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }))

router.route("/").post(addMedications).get(getMedications);
router.route("/:med_id").put(updateMedications).delete(deleteMedications).get(getMedication);
router.route("/update/status").get(markDone);

module.exports = router;