const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Plot = require("../models/plot");
const Subscription = require("../models/subscription");
const Payment = require("../models/payment");
const { createNotification } = require("../services/notificationServices");

const createOrder = async (req, res) => {
    try {
        const { plotId, duration } = req.body;

        // Validation
        if (!plotId) {
            return res.status(400).json({
                success: false,
                message: "Plot ID is required"
            });
        }

        if (!duration || duration <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(plotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID format"
            });
        }

        const plot = await Plot.findById(plotId);
        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }

        if (plot.status !== "Available") {
            return res.status(400).json({
                success: false,
                message: "Plot is not available for subscription"
            });
        }

        const options = {
            amount: plot.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        const payment = await Payment.create({
            user: req.user._id,
            plot: plotId,
            amount: plot.price,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "Pending",
            duration: duration
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                paymentId: payment._id
            }
        });

    } catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plotId, duration } = req.body;

        // Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Razorpay credentials are required"
            });
        }

        if (!plotId || !duration) {
            return res.status(400).json({
                success: false,
                message: "Plot ID and duration are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(plotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID format"
            });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Invalid signature"
            });
        }

        // Find payment
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Check authorization
        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized payment access"
            });
        }

        // Check if already processed
        if (payment.status === "Success") {
            return res.status(400).json({
                success: false,
                message: "Payment already processed"
            });
        }

        // Check for existing subscription
        const existingSubscription = await Subscription.findOne({
            plot: plotId,
            user: req.user._id,
            status: "Active"
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: "You already have an active subscription for this plot"
            });
        }

        // Update payment
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = "Success";
        await payment.save();

        // Create subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + Number(duration));

        const subscription = await Subscription.create({
            user: req.user._id,
            plot: plotId,
            paymentId: payment._id,
            duration,
            amount: payment.amount,
            startDate,
            endDate,
            status: "Active"
        });

        // Update plot status
        const plot = await Plot.findById(plotId);
        if (plot) {
            plot.status = "Subscribed";
            await plot.save();
        }

        // Create notification
        try {
            await createNotification({
                user: req.user._id,
                title: "Payment Successful 🎉",
                type: "SUBSCRIPTION",
                message: plot ? `Your subscription to plot ${plot.plotNumber} has been confirmed` : "Your subscription has been confirmed"
            });
        } catch (notificationError) {
            console.error("Notification error:", notificationError);
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            subscription: {
                id: subscription._id,
                plot: plot?.plotNumber,
                startDate,
                endDate,
                amount: payment.amount,
                status: "Active"
            }
        });

    } catch (error) {
        console.error("Verify payment error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getMyPayment = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const payments = await Payment.find({
            user: req.user._id
        })
            .populate("plot", "plotNumber price status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get my payment error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID format"
            });
        }

        const payment = await Payment.findById(id)
            .populate("plot", "plotNumber price status")
            .populate("user", "name email");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Check authorization
        if (payment.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot access this payment"
            });
        }

        return res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Get payment by ID error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        if (!signature) {
            return res.status(400).json({
                success: false,
                message: "Webhook signature missing"
            });
        }

        const payloadString = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payloadString)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature"
            });
        }

        const event = req.body;

        if (event.event === "payment.captured") {
            const paymentData = event.payload.payment.entity;
            const razorpay_order_id = paymentData.order_id;
            const razorpay_payment_id = paymentData.id;

            const payment = await Payment.findOne({
                razorpayOrderId: razorpay_order_id
            });

            if (!payment) {
                return res.status(200).json({
                    success: true,
                    message: "Payment record not found, ignoring"
                });
            }

            if (payment.status === "Success") {
                return res.status(200).json({
                    success: true,
                    message: "Payment already processed"
                });
            }

            // Check for existing subscription
            const existingSubscription = await Subscription.findOne({
                plot: payment.plot,
                user: payment.user,
                status: "Active"
            });

            if (existingSubscription) {
                return res.status(200).json({
                    success: true,
                    message: "Subscription already exists"
                });
            }

            // Update payment
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.razorpaySignature = signature;
            payment.status = "Success";
            await payment.save();

            // Create subscription
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + (payment.duration || 30));

            await Subscription.create({
                user: payment.user,
                plot: payment.plot,
                paymentId: payment._id,
                duration: payment.duration,
                amount: payment.amount,
                startDate,
                endDate,
                status: "Active"
            });

            // Update plot
            const plot = await Plot.findById(payment.plot);
            if (plot) {
                plot.status = "Subscribed";
                await plot.save();
            }

            // Create notification
            try {
                await createNotification({
                    user: payment.user,
                    title: "Payment Successful 🎉",
                    type: "SUBSCRIPTION",
                    message: plot ? `Your subscription to plot ${plot.plotNumber} has been confirmed` : "Your subscription has been confirmed"
                });
            } catch (notificationError) {
                console.error("Notification error:", notificationError);
            }

        } else if (event.event === "payment.failed") {
            const paymentData = event.payload.payment.entity;
            const payment = await Payment.findOne({
                razorpayOrderId: paymentData.order_id
            });

            if (payment) {
                payment.status = "Failed";
                payment.failureReason = paymentData.error_description || "Payment failed";
                await payment.save();

                try {
                    await createNotification({
                        user: payment.user,
                        title: "Payment Failed ❌",
                        type: "SUBSCRIPTION",
                        message: "Your payment has failed. Please retry after some time"
                    });
                } catch (notificationError) {
                    console.error("Notification error:", notificationError);
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        });

    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const retryPayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID format"
            });
        }

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Check authorization
        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Only allow retry for failed/pending payments
        if (payment.status === "Success") {
            return res.status(400).json({
                success: false,
                message: "Cannot retry a successful payment"
            });
        }

        const plot = await Plot.findById(payment.plot);
        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }

        // Create new Razorpay order
        const newOrder = await razorpay.orders.create({
            amount: plot.price * 100,
            currency: "INR",
            receipt: `payment_${Date.now()}`
        });

        // Update payment with new order
        payment.razorpayOrderId = newOrder.id;
        payment.status = "Pending";
        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Payment retry order created",
            order: {
                id: newOrder.id,
                amount: newOrder.amount,
                currency: newOrder.currency,
                paymentId: payment._id
            }
        });

    } catch (error) {
        console.error("Retry payment error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getMyPayment,
    getPaymentById,
    handleWebhook,
    retryPayment
};