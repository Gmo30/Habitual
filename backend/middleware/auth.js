import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    let token;

    //Check for the token in the cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }

    try {
        //Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Find the user, excluding the hashed password
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user no longer exists" });
        }

        next();

        return;
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Not authorized, token expired" });
        }

        return res.status(401).json({ message: "Not authorized, invalid token" });
    }

};