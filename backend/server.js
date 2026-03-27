const dotEnv = require("dotenv");
dotEnv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const cookiesParser = require("cookie-parser");
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
    type:"application/json"
}));

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookiesParser());

app.use("/api/auth", authRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on this ${process.env.PORT} port`);
});
