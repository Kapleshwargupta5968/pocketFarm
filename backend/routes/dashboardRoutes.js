const express = require("express");
const router = express.Router();

const {getDashboardStats, getEarningData,getDashboardTable } = require("../controllers/dashboardController");
const {authProtector, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authProtector, authorizeRoles("Admin"), getDashboardStats);
router.get("/earnings", authProtector, authorizeRoles("Admin"), getEarningData);
router.get("/table", authProtector, getDashboardTable);

module.exports = router;