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
        type:String
    },
    razorpaySignature:{
        type:String
    },
    duration:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Success","Failed"],
        default:"Pending"
    },
    failureReason:{
        type:String,
        default:""
    }
}, {timestamps:true});

module.exports = mongoose.model("Payment",paymentSchema);