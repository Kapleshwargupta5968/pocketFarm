const Notification = require("../models/notification");
const { getIO, users } = require("../config/socket");

const createNotification = async ({user, title, message, type}) => {
    try{
        const notification = await Notification.create({
            user,
            title,
            message,
            type
        });
        
        // Emit via socket in real-time
        const userId = user.toString();
        console.log("📬 Creating notification for user:", userId);
        console.log("📊 Available users in registry:", Object.keys(users));
        
        if(users[userId]){
            try {
                const io = getIO();
                io.to(users[userId]).emit("newNotification", notification);
                console.log("✅ Notification emitted to socket:", users[userId]);
            } catch(socketError) {
                console.error("❌ Error emitting notification:", socketError.message);
            }
        } else {
            console.log("⚠️ User not found in socket registry:", userId);
        }
    }catch(error){
        console.error("❌ Error creating notification:", error.message);
    }
}

module.exports = {createNotification};