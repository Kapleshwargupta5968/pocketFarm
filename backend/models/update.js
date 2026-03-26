const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
    plot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plot",
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
}, {timestamps:true});

module.exports = mongoose.model("Update", updateSchema);