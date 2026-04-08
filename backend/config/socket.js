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
        // console.log("✅ Socket connected:", socket.id);

        socket.on("register", (userId) => {
            users[userId] = socket.id;
            // console.log("📍 User registered:", userId, "→ Socket:", socket.id);
            // console.log("📊 Active users:", Object.keys(users));
        });

        socket.on("disconnect", () => {
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    // console.log("❌ User disconnected:", userId);
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
