const Subscription = require("../models/subscription");
const Plot = require("../models/plot");
const Payment = require("../models/payment");
const User = require("../models/user");
const { createNotification } = require("../services/notificationServices");
const mongoose = require("mongoose");

const subscribePlot = async (req, res) => {
    try {
        const { plotId, paymentId, duration } = req.body;

        // Validation
        if (!plotId || !paymentId || !duration) {
            return res.status(400).json({
                success: false,
                message: "Plot ID, Payment ID, and duration are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(plotId) || !mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Plot ID or Payment ID format"
            });
        }

        if (duration <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0"
            });
        }

        // Find plot
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

        // Verify payment exists and is successful
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (payment.status !== "Success") {
            return res.status(400).json({
                success: false,
                message: "Payment must be marked as successful"
            });
        }

        // Verify payment belongs to current user
        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Payment does not belong to current user"
            });
        }

        // Check for existing active subscription
        const existingSubscription = await Subscription.findOne({
            user: req.user._id,
            plot: plotId,
            status: "Active"
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: "You already have an active subscription for this plot"
            });
        }

        // Create subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + Number(duration));

        const subscription = await Subscription.create({
            user: req.user._id,
            plot: plotId,
            paymentId,
            duration,
            amount: payment.amount,
            startDate,
            endDate,
            status: "Active"
        });

        // Update plot status
        if (plot) {
            plot.status = "Subscribed";
            await plot.save();
        }

        // Get subscriber details
        const subscriber = await User.findById(req.user._id).select("name email");

        // Create notification for SUBSCRIBER
        try {
            console.log("🔔 Attempting to create notification for subscriber:", req.user._id);
            await createNotification({
                user: req.user._id,
                title: "Subscription Successful",
                message: `You have successfully subscribed to plot ${plot.plotNumber} for ${duration} days`,
                type: "SUBSCRIPTION"
            });
            console.log("✅ Subscriber notification created");
        } catch (notificationError) {
            console.error("❌ Subscriber notification error:", notificationError.message);
        }

        // Create notification for FARMER (plot owner)
        try {
            console.log("🚜 Plot object:", { plotId, plotNumber: plot.plotNumber, farmerUserId: plot.farmer });
            console.log("🚜 Creating notification for farmer:", plot.farmer);
            await createNotification({
                user: plot.farmer,
                title: "New Subscription! 🎉",
                message: `${subscriber?.name || "A user"} has subscribed to your plot ${plot.plotNumber} for ${duration} days. Amount: ₹${payment.amount}`,
                type: "SUBSCRIPTION"
            });
            console.log("✅ Farmer notification created successfully");
        } catch (notificationError) {
            console.error("❌ Farmer notification error:", notificationError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            subscription: {
                id: subscription._id,
                plot: plot.plotNumber,
                startDate,
                endDate,
                amount: payment.amount,
                status: "Active"
            }
        });

    } catch (error) {
        console.error("Subscribe plot error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getMySubscriptions = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const subscriptions = await Subscription.find({ user: req.user._id })
            .populate({
                path: "plot",
                select: "_id plotNumber currentCrop size price status location farmer images sowingDate expectedHarvestDate",
                populate: {
                    path: "farmer",
                    select: "name email"
                }
            })
            .populate("paymentId", "amount razorpayPaymentId")
            .sort({ createdAt: -1 });

        const activeCount = subscriptions.filter(sub => sub.status === "Active").length;

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            activeCount,
            subscriptions
        });

    } catch (error) {
        console.error("Get my subscriptions error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID format"
            });
        }

        const subscription = await Subscription.findById(id)
            .populate("plot", "plotNumber currentCrop size price status location")
            .populate("paymentId", "amount razorpayPaymentId")
            .populate("user", "name email");

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Check authorization
        if (subscription.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot access this subscription"
            });
        }

        return res.status(200).json({
            success: true,
            subscription
        });

    } catch (error) {
        console.error("Get subscription by ID error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID format"
            });
        }

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Check authorization
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot cancel this subscription"
            });
        }

        if (subscription.status !== "Active") {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel ${subscription.status} subscription`
            });
        }

        // Update subscription status
        subscription.status = "Cancelled";
        await subscription.save();

        // Update plot status back to Available
        const plot = await Plot.findByIdAndUpdate(subscription.plot, { status: "Available" }, { new: true });

        // Get subscriber details
        const subscriber = await User.findById(req.user._id).select("name");

        // Create notification for SUBSCRIBER
        try {
            await createNotification({
                user: req.user._id,
                title: "Subscription Cancelled",
                message: `Your subscription to plot ${plot.plotNumber} has been cancelled`,
                type: "SUBSCRIPTION"
            });
        } catch (notificationError) {
            console.error("Subscriber cancellation notification error:", notificationError);
        }

        // Create notification for FARMER (plot owner)
        try {
            await createNotification({
                user: plot.farmer,
                title: "Subscription Cancelled 📋",
                message: `${subscriber?.name || "A subscriber"} has cancelled their subscription to plot ${plot.plotNumber}`,
                type: "SUBSCRIPTION"
            });
        } catch (notificationError) {
            console.error("Farmer cancellation notification error:", notificationError);
        }

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully"
        });

    } catch (error) {
        console.error("Cancel subscription error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const renewSubscription = async (req, res) => {
    try {
        const { subscriptionId, paymentId, duration } = req.body;

        // Validation
        if (!subscriptionId || !paymentId || !duration) {
            return res.status(400).json({
                success: false,
                message: "Subscription ID, Payment ID, and duration are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(subscriptionId) || !mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Subscription ID or Payment ID format"
            });
        }

        if (duration <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0"
            });
        }

        // Find subscription
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Check authorization
        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot renew this subscription"
            });
        }

        // Verify payment
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (payment.status !== "Success") {
            return res.status(400).json({
                success: false,
                message: "Payment must be successful"
            });
        }

        // Calculate new end date
        const currentEndDate = new Date(subscription.endDate);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + Number(duration));

        // Update subscription
        subscription.endDate = newEndDate;
        subscription.paymentId = paymentId;
        subscription.status = "Active";
        await subscription.save();

        // Create notification
        try {
            const plot = await Plot.findById(subscription.plot);
            const subscriber = await User.findById(req.user._id).select("name");
            
            // Notification for SUBSCRIBER
            await createNotification({
                user: req.user._id,
                title: "Subscription Renewed",
                message: `Your subscription to plot ${plot.plotNumber} has been renewed until ${newEndDate.toLocaleDateString('en-IN')}`,
                type: "SUBSCRIPTION"
            });

            // Notification for FARMER
            await createNotification({
                user: plot.farmer,
                title: "Subscription Renewed ✅",
                message: `${subscriber?.name || "A subscriber"} has renewed their subscription to plot ${plot.plotNumber}. New end date: ${newEndDate.toLocaleDateString('en-IN')}. Amount: ₹${payment.amount}`,
                type: "SUBSCRIPTION"
            });
        } catch (notificationError) {
            console.error("Renewal notification error:", notificationError);
        }

        return res.status(200).json({
            success: true,
            message: "Subscription renewed successfully",
            subscription: {
                id: subscription._id,
                newEndDate,
                status: "Active"
            }
        });

    } catch (error) {
        console.error("Renew subscription error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

module.exports = {
    subscribePlot,
    getMySubscriptions,
    getSubscriptionById,
    cancelSubscription,
    renewSubscription
};