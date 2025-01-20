import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Please login to continue" });
        }

        // Check if token is blacklisted
        const isTokenBlacklisted = await redisClient.get(token);
        if (isTokenBlacklisted) {
            res.cookie('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: new Date(0)
            });
            return res.status(401).json({ error: "Session expired, please login again" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token, please login again" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired, please login again" });
        }
        res.status(500).json({ error: "Server error, please try again" });
    }
}