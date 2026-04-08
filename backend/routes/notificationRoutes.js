const express = require("express");
const router = express.Router();
const {authProtector} = require("../middlewares/authMiddleware");
const {createNotification, getMyNotification, markAsRead, markAllAsRead, deleteNotification} = require("../controllers/notificationController");

// Specific routes BEFORE parametric routes
router.post("/", authProtector, createNotification);
router.get("/", authProtector, getMyNotification);
router.put("/mark-all-read", authProtector, markAllAsRead);  // Must come BEFORE /:id routes
router.put("/:id/read", authProtector, markAsRead);
router.delete("/:id", authProtector, deleteNotification);

module.exports = router;