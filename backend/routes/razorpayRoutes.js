const express = require("express");
const router = express.Router();

const {createOrder, verifyPayment, getMyPayment, getPaymentById, handleWebhook, retryPayment} = require("../controllers/paymentController");
const {authProtector} = require("../middlewares/authMiddleware");

router.post("/create-order", authProtector, createOrder);
router.post("/verify-payment", authProtector, verifyPayment);
router.get("/", authProtector, getMyPayment);
router.get("/:id", authProtector, getPaymentById);
router.post("/webhook", handleWebhook);
router.post("/retry/:id", authProtector, retryPayment); 

module.exports = router;