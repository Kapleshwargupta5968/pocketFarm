const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected successfully on this ${conn.connection.host} url`);
    }catch(error){
        console.log("MongoDB connection failed");
    }
}

module.exports = connectDB;