const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    plot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plot",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        default:"INR"
    },
    razorpayOrderId:{
        type:String,
        required:true
    },
    razorpayPaymentId:{
        type:String,
        required:true
    },
    razorpaySignature:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    },
}, {timestamps:true});

module.exports = mongoose.model("Payment",paymentSchema);