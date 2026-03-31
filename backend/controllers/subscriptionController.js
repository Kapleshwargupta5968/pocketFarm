const Subscription = require("../models/subscription");
const Plot = require("../models/plot");
const Payment = require("../models/payment");
const { createNotification } = require("../services/notificationServices");

const subscribePlot = async (req, res) => {
    try {
        const { plotId, paymentId, duration } = req.body;

        if (!plotId) {
            return res.status(400).json({
                success: false,
                message: "Plot ID is required"
            });
        }

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        if (!duration) {
            return res.status(400).json({
                success: false,
                message: "Duration is required"
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
                message: "Plot not available"
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
                message: "Payment must be successful to subscribe"
            });
        }

        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Payment does not belong to current user"
            });
        }

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

        plot.status = "Subscribed";
        await plot.save();

        await createNotification({
            user: req.user._id,
            title: "Subscription Successful",
            message: `You have successfully subscribed to plot ${plot.plotNumber} for ${duration} days`,
            type: "SUBSCRIPTION"
        });

        return res.status(201).json({
            success: true,
            message: "Subscription successful",
            subscription
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message}`
        });
    }
};


const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            user: req.user._id
        }).populate("plot").populate("paymentId");

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No subscriptions found",
                subscriptions: []
            });
        }

        return res.status(200).json({
            success: true,
            subscriptions
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        if (subscription.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        subscription.status = "Cancelled";
        await subscription.save();

        const plot = await Plot.findById(subscription.plot);
        if (plot) {
            plot.status = "Available";
            await plot.save();
        }

        await createNotification({
            user: req.user._id,
            title: "Subscription Cancelled",
            message: `Your subscription to plot ${plot?.plotNumber || "unknown"} has been cancelled successfully`,
            type: "SUBSCRIPTION"
        });

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            subscription
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

module.exports = {
    subscribePlot,
    getSubscriptions,
    cancelSubscription
};