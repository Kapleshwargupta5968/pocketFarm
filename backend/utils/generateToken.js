const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"7d"});
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"7d"});
};

module.exports = {generateAccessToken, generateRefreshToken};