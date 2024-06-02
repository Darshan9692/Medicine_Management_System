const express = require("express");
const { register, login, logout, deleteUser, getUser, getUsers, updateMyProfile, getMyProfile, deleteMyProfile } = require("../controllers/authController");
const passport = require("passport");
const router = express.Router();

//auth
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), logout);

//user
router.route("/user").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), getMyProfile).delete(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), deleteMyProfile).put(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }), updateMyProfile);

//admin
router.route("/user/:user_id").get(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),getUser).delete(passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),deleteUser);
router.route("/users").get(getUsers);

//category
router.route("/categories").get()


module.exports = router;