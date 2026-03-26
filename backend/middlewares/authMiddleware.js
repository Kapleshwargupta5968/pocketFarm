const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authProtector = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"unauthorized, token missing"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findeById(decoded.id).select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Token invalid or expired"
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }
        next();
    }
}

module.exports = {authProtector, authorizeRoles}