const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Farmer", "Subscriber"],
        default: "Subscriber"
    },
    subscribedPlots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plot"
    }],
    refreshToken: {
        type: String
    },
},
    {
        timestamps: true
    }
);


userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password") || !this.password) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.log(`Password hashing problem due to this ${error.message} reason`);
    }
});


userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);