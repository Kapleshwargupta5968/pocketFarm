const express = require("express");
const router = express.Router();

const {getDashboardStats} = require("../controllers/dashboardController");
const {authProtector, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authProtector, authorizeRoles("Admin"), getDashboardStats);

module.exports = router;