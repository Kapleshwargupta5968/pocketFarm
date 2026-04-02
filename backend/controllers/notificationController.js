const Notification = require("../models/notification");
const mongoose = require("mongoose");
const { getIO, users } = require("../config/socket");



const createNotification = async (req, res) => {
    try{
        const {user, title, message, type} = req.body;
      const notification = await Notification.create({
        user,
        title,
        message,
        type
      });

      const userId = user.toString();
      if(users[userId]){
        getIO().to(users[userId]).emit("newNotification", notification);
      }

      return res.status(201).json({
        success: true,
        message: "Notification created successfully",
        notification
      });   
    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getMyNotification = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const notifications = await Notification.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error("Error in getMyNotification:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID format"
            });
        }

        const notification = await Notification.findById(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot modify this notification"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.error("Error in markAsRead:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Error in markAllAsRead:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID format"
            });
        }

        const notification = await Notification.findById(id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Cannot delete this notification"
            });
        }

        await Notification.deleteOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

module.exports = {
    createNotification,
    getMyNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
};