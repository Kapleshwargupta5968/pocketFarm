const express = require("express");
const router = express.Router();
const {
    subscribePlot,
    getMySubscriptions,
    getSubscriptionById,
    cancelSubscription,
    renewSubscription
} = require("../controllers/subscriptionController");

const { authProtector } = require("../middlewares/authMiddleware");

// Subscribe to a plot
router.post("/subscribe", authProtector, subscribePlot);

// Get all my subscriptions
router.get("/my-subscriptions", authProtector, getMySubscriptions);

// Get specific subscription
router.get("/:id", authProtector, getSubscriptionById);

// Cancel subscription
router.delete("/:id/cancel", authProtector, cancelSubscription);

// Renew subscription
router.post("/renew", authProtector, renewSubscription);

module.exports = router;