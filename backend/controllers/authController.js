const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exist"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            message: "User registered successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal Server error, due to this ${error.message} reason`
        });
    }
};


const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            message: "User login successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        })
    }
};


const refreshAccessToken = async (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token missing"
        });
    }
    try {

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const newAccessToken = generateAccessToken(payload);

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: `Token expired or invalid, due to this ${error.message} reason`
        });
    }
};


const logout = async (req, res) => {
    try {

        const {refreshToken} = req.cookies;
        if(refreshToken){
            await User.findByIdAndUpdate(req.user.id,{
                $unset: {refreshToken: 1}
            });
        }

        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logout successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error.message}`
        });
    }
}


module.exports = { signup, signin, refreshAccessToken, logout };