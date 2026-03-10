const dotEnv = require("dotenv");
dotEnv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const cookiesParser = require("cookie-parser");
const connectDB = require("./config/database");
connectDB();

const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookiesParser());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on this ${process.env.PORT} port`);
});
