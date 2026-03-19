const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema({
    plotNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    size: {
        type: Number,
        required: true,
        min:1
    },
    price: {
        type: Number,
        required: true,
        min:1
    },
    status: {
        type: String,
        enum: ["Available", "Subscribed", "Harvesting", "Inactive"],
        default: "Available"
    },
    currentCrop: {
        type: String
    },
    sowingDate: {
        type: Date
    },
    expectedHarvestDate: {
        type: Date
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validation:{
                validator: (val) => val.length === 2,
                message: "Coordinates must be [longitude, latitude]" 
            }
        }
    },
    images: [
        {
            type: String
        }
    ],


},{timestamps:true});

plotSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Plot", plotSchema);