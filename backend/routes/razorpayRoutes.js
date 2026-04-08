const express = require("express");
const router = express.Router();

const {
    createOrder,
    verifyPayment,
    getMyPayment,
    getPaymentById,
    handleWebhook,
    retryPayment,
    getFarmerEarnings
} = require("../controllers/paymentController");

const { authProtector, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/create-order", authProtector, createOrder);

router.post("/verify-payment", authProtector, verifyPayment);

// Specific routes BEFORE parametric routes
router.get("/history", authProtector, getMyPayment);
router.get("/farmer/earnings", authProtector, authorizeRoles("Farmer"), getFarmerEarnings);

// Parametric routes after specific routes
router.get("/:id", authProtector, getPaymentById);
router.post("/webhook", handleWebhook);

router.post("/retry/:id", authProtector, retryPayment);

module.exports = router;