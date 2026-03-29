const express = require("express");
const { signup, signin, refreshAccessToken, logout, getCurrentUser } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

module.exports = router;