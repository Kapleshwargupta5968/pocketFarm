const express = require("express");
const router = express.Router();

const {getDashboardStats, getEarningData,getDashboardTable } = require("../controllers/dashboardController");
const {authProtector, authorizeRoles} = require("../middlewares/authMiddleware");

router.get("/", authProtector, authorizeRoles("Farmer", "Subscriber"), getDashboardStats);
router.get("/earnings", authProtector, authorizeRoles("Farmer"), getEarningData);
router.get("/table", authProtector, authorizeRoles("Farmer", "Subscriber"), getDashboardTable);

module.exports = router;