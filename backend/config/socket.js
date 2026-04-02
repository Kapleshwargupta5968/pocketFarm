// Dedicated Socket.IO instance holder — avoids circular dependency with server.js

let io;
const users = {};

const initSocket = (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);

        socket.on("register", (userId) => {
            users[userId] = socket.id;
        });

        socket.on("disconnect", () => {
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.IO not initialized. Call initSocket() first.");
    return io;
};

module.exports = { initSocket, getIO, users };
