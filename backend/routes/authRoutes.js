const express = require("express");
const { signup, signin, refreshAccessToken, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;