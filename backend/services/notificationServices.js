const Notification = require("../models/notification");

const createNotification = async ({user, title, message, type}) => {
    try{
        await Notification.create({
            user,
            title,
            message,
            type
        });
        console.log("Notification created successfully");
    }catch(error){
        console.error("Error creating notification", error);
    }
}

module.exports = {createNotification};