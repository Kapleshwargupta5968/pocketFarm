const Update = require("../models/update");
const Plot = require("../models/plot");
const Subscription = require("../models/subscription");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const { createNotification } = require("../services/notificationServices");
const uploadUpdate = async (req, res) => {
    try {
        const { plotId, description } = req.body;

        if (!plotId) {
            return res.status(400).json({
                success: false,
                message: "Plot ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(plotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const uploadResult = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`, {
            folder: "pocketFarm/updates",
            resource_type: "image",
        });

        if (!uploadResult) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image"
            })
        }

        const imageUrl = uploadResult.secure_url;

        const plot = await Plot.findById(plotId);

        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }
        if (plot.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (plot.status !== "Subscribed") {
            return res.status(400).json({
                success: false,
                message: "Cannot upload update, plot is not subscribed."
            })
        }

        const update = await Update.create({
            plot: plotId,
            imageUrl,
            description
        });

        const subscription = await Subscription.findOne({
            plot: plotId,
            status: "Active"
        });

        if (subscription && subscription.user) {
            await createNotification({
                user: subscription.user,
                title: "New Farm Update 🌱",
                message: "Your subscribed plot has been updated",
                type: "UPDATE"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Update uploaded successfully",
            update
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message}`
        });
    }
};

const getPlotUpdate = async (req, res) => {
    try {
        const plotId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(plotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID"
            });
        }
        const subscription = await Subscription.findOne({
            plot: plotId,
            user: req.user._id,
            status: "Active"
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "You are not subscribed to this plot"
            });
        }

        const updates = await Update.find({
            plot: plotId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Update data fetch successfully",
            updates
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message}`
        });
    }
};

module.exports = { uploadUpdate, getPlotUpdate };