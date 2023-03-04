const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");

const newUserController = require("../controllers/newUserController");

router.route("/").post(newUserController.createNewUser);

router.route("/:id/verify/:token/").get(newUserController.verifyUser);

module.exports = router;
