const dotEnv = require("dotenv");
dotEnv.config();

const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const users = {};

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

const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
connectDB();

require("./crons/subscriptionCron");

const authRoutes = require("./routes/authRoutes");
const plotRoutes = require("./routes/plotRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const updateRoutes = require("./routes/updateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/razorpayRoutes");

app.use("/api/payment/webhook", express.raw({
    type: "application/json"
}));

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = { io, users };

server.listen(process.env.PORT, () => {
    console.log(`Server is listening on this ${process.env.PORT} port`);
});
