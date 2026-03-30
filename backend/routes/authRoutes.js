const express = require("express");
const { signup, signin, refreshAccessToken, logout, getCurrentUser } = require("../controllers/authController");
const router = express.Router();

const { authProtector } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refreshToken", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", authProtector, getCurrentUser);

module.exports = router;