const razorpay = require("razorpay");
const crypto = require("crypto");
const Plot = require("../models/plot");
const Subscription = require("../models/subscription");
const CreateNotification = require("../services/notificationServices");

const createOrder = async (req, res) => {
    try{
        const {plotId} = req.body;
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

        const options = {
            amount: plot.price * 100,
            currency:"INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        }

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success:true,
            message:"Order created successfully",
            order
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Internal server error, due to this ${error.message} reason`
        })
    }
};

const verifyPayment = async (req, res) => {
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, plotId, duration} = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({
                success:false,
                message:"Payment verification failed"
            });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + duration);

        const subscription = await Subscription.create({
            user: req.user._id,
            plot:plotId,
            startDate,
            endDate
        });

        const plot = await Plot.findById(plotId);
        plot.status = "Subscribed",
        await plot.save();

        await CreateNotification({
            user:req.user._id,
            type:"Subscription",
            message:`Your subscription to plot ${plot.plotNumber} has been confirmed`,
            plot:plotId
        });

        return res.status(200).json({
            success:true,
            message:"Payment verified successfully",
            subscription
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Internal server error, due to this ${error.message} reason`
        })
    }
}

module.exports = {
    createOrder,
    verifyPayment
};