const notification = require("../models/notification");
const Notification = require("../models/notification");
const mongoose = require("mongoose");

const getMyNotification = async (req,res) => {
    try{
        const notifications = await Notification.find({
            user: req.user._id
        }).sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count: notification.length,
            notifications
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const markAsRead = async (req, res) => {
    try{
        const notificationId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(notificationId)){
            return res.status(400).json({
                success:false,
                message:"Invalid notification ID"
            });
        }

        const notification = await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({
                success:false,
                message:"Notification not found"
            });
        }

        if(notification.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json*({
            success:true,
            message:"Notification marked as read"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const markAllAsRead = async (req, res) => {
    try{
        const notifications = await Notification.updateMany(
            {user: req.user._id},
            {$set: {isRead: true}}
        );

        return res.status(200).json({
            success:true,
            message:"All notifications marked as read"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};


const deleteNotification = async (req, res) => {
    try{
        const notificationId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(notificationId)){
            return res.status(400).json({
                success:false,
                message:"Invalid notification ID"
            });
        }

        const notification = await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({
                success:false,
                message:"Notification not found"
            });
        }

        if(notification.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            });
        }

        await notification.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Notification deleted successfully"
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

module.exports = {
    getMyNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
};