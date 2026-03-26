const express = require("express");
const router = express.Router();
const {authProtector} = require("../middlewares/authMiddleware");
const {getMyNotification, markAsRead, markAllAsRead, deleteNotification} = require("../controllers/notificationController");

router.get("/", authProtector, getMyNotification);
router.put("/:id/read", authProtector, markAsRead);
router.put("/mark-all-read", authProtector, markAllAsRead);
router.delete("/:id", authProtector, deleteNotification);

module.exports = router;