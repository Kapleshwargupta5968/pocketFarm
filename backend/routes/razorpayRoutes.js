const express = require("express");
const router = express.Router();

const {createOrder, verifyPayment} = require("../controllers/paymentController");
const {authProtector} = require("../middlewares/authMiddleware");

router.post("/create-order", authProtector, createOrder);
router.post("/verify-payment", authProtector, verifyPayment);

module.exports = router;