const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Plot = require("../models/plot");
const Subscription = require("../models/subscription");
const Payment = require("../models/payment");
const {createNotification} = require("../services/notificationServices");

const createOrder = async (req, res) => {
    try{
        const {plotId} = req.body;
        if(!plotId || !mongoose.Types.ObjectId.isValid(plotId)){
            return res.status(404).json({
                success:false,
                message:"Invalid plot ID"
            });
        }

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

        await Payment.create({
            user: req.user._id,
            plot:plotId,
            amount:plot.price,
            currency:"INR",
            razorpayOrderId:order.id,
            status:"Pending"
        })

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

        if(!plotId || !duration){
            return res.status(400).json({
                success:false,
                message:"Plot ID and duration are required"
            });
        }

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

        const payment = await Payment.findOne({
            razorpayOrderId:razorpay_order_id
        });

        if(!payment){
            return res.status(404).json({
                success:false,
                message:"Payment not found"
            });
        }

        if(payment.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorized payment access"
            });
        }

        if(payment.status === "Paid"){
            return res.status(400).json({
                success:false,
                message:"Payment already processed"
            });
        }

        const existingSubscription = await Subscription.findOne({
            plot:plotId,
            status:"Active"
        });

        if(existingSubscription){
            return res.status(400).json({
                success:false,
                message:"You have already subscribed to this plot"
            });
        }

        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = "Paid";
        await payment.save();

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
        if(plot){
            plot.status = "Subscribed";
            await plot.save();
        }

        await createNotification({
            user:req.user._id,
            title:"Payment Successfull 🎉",
            type:"Subscription",
            message:plot ? `Your subscription to plot ${plot.plotNumber} has been confirmed` : "Your subscription has been confirmed",
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
};

const getMyPayment = async (req, res) => {
    try{
        const payment = await Payment.find({
            user:req.user._id
        }).populate("plot")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            message:"Payment fetched successfully",
            payment
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Internal server error, due to this ${error.message} reason`
        })
    }
};

const getPaymentById = async (req, res) => {
    try{
        const {paymentId} = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(paymentId)){
            return res.status(400).json({
                success:false,
                message:"Invalid payment ID"
            });
        }

        const payment = await Payment.findById(paymentId)
        .populate("plot");

        if(!payment){
            return res.status(404).json({
                success:false,
                message:"Payment not found"
            });
        }

        if(payment.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Payment fetched successfully",
            payment
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
    verifyPayment,
    getMyPayment,
    getPaymentById
};