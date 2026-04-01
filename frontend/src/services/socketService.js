import {io} from "socket.io-client";
import config from "../config/config";

const socket = io(config.appUrl, {
    withCredentials:true,
    extraHeaders:{
        "socket-client":"pocketFarm"
    }
});

export default socket;