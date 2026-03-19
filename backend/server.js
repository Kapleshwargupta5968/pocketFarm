const dotEnv = require("dotenv");
dotEnv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const cookiesParser = require("cookie-parser");
const connectDB = require("./config/database");
connectDB();

const authRoutes = require("./routes/authRoutes");
const plotRoutes = require("./routes/plotRoutes");

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookiesParser());
app.use("/api/auth", authRoutes);
app.use("/api/plots", plotRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on this ${process.env.PORT} port`);
});
