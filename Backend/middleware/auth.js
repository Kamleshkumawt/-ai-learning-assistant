import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const protect = async (req, res, next) => {
    let token;

    //Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Get user from token
            req.user = await userModel.findById(decoded.id).select("-password");

            if(!req.user) {
                res.status(401).json({
                    success: false,
                    error: "User not found",
                    statusCode: 401
                });
            }

            next();
        } catch (error) {
            console.log(error);
        console.error("Auth middleware error:", error.message);

        if(error.name = 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: "Token has expired",
                statusCode: 401
            });
        } 
            return res.status(401).json({
                success: false,
                error: "Not authorized, token failed",
                statusCode: 401
            });
        }
    }

    if(!token) {
        return res.status(401).json({
            success: false,
            error: "Not authorized, no token",
            statusCode: 401
        });
    }
};

export default protect;