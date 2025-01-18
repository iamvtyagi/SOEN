import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req,res,next) => {
     try{
        const token = req.cookies.token || req.header.authorization.split(" ")[1];
        if(!token) return res.status(401).json({error: "Unauthorized"});

        const isTokenBlacklisted = await redisClient.get(token);
        if(isTokenBlacklisted){
          res.cookie("token", "");
         return res.status(401).json({error: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
     }catch(err){
        res.status(500).json({error: err.message});
     }
}