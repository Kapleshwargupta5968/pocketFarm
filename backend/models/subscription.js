const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    plot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plot",
        required:true
    },
    startDate:{
        type:Date,
        required:Date.now
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["Active", "Completed", "Cancelled"],
        default:"Active"
    }
}, {timestamps:true});


module.exports = mongoose.model("Subscription", subscriptionSchema);