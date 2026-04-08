import {io} from "socket.io-client";
import config from "../config/config";

const socket = io(config.appUrl, {
    withCredentials:true,
    extraHeaders:{
        "socket-client":"pocketFarm"
    }
});

socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
});

export default socket;