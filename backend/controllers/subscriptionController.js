const Subscription = require("../models/subscription");
const Plot = require("../models/plot");
const subscription = require("../models/subscription");
const { createNotification } = require("../services/notificationServices");

const subscribePlot = async (req, res) => {
    try{
        const {plotId, duration} = req.body;
        const plot = await Plot.findById(plotId);

        if(!plot){
            return res.status(404).json({
                success:false,
                message:"Plot not found"
            });
        }

        if(plot.status !== "Available"){
            return res.status(400).json({
                success:false,
                message:"Plot not available"
            });
        }

        const startDate = new Date();
        const endDate = new Date();

        endDate.setDate(startDate.getDate() + Number(duration));

        const subscription = await Subscription.create({
            user: req.user._id,
            plot: plotId,
            startDate,
            endDate
        });

        plot.status = "Subscribed";
        await plot.save();

        await createNotification({
            user:req.user._id,
            title:"Subscription Successfull",
            message:`You have successfully subscribed to plot ${plot.plotNumber} for ${duration} days`,
            type:"SUBSCRIPTION"
        });

        return res.status(200).json({
            success:true,
            message: "Subscription successfully",
            subscription
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message}`
        });
    }
};


const getSubscriptions = async (req, res) => {
    try{
        const subscriptions = await Subscription.find({
            user: req.user._id
        }).populate("plot");

        if(!subscriptions){
            return res.status(404).json({
                success:false,
                message:"No subscriptions found"
            });
        }

        return res.status(200).json({
            success:true,
            subscriptions
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

const cancelSubscription = async (req, res) => {
    try{
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription){
            return res.status(404).json({
                success:false,
                message:"Subscription not found"
            });
        }
        if(subscription.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            });
        }
        subscription.status = "Cancelled";
        await subscription.save();

        const plot = await Plot.findById(subscription.plot);
        plot.status = "Available";
        await plot.save();

        await createNotification({
            user:req.user._id,
            title:"Subscription Cancelled",
            message:`Your subscription to plot ${plot.plotNumber} has been cancelled successfully`,
            type:"SUBSCRIPTION"
        });

        return res.status(200).json({
            success:true,
            message:"Subscription cancelled successfully",
            subscription
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

module.exports = {
    subscribePlot,
    getSubscriptions,
    cancelSubscription
};