import  userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await userService.createUser(req.body);
        const token = user.generateToken();
        res.status(201).json({user, token});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

export const loginUserController = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return;
    }

    try{
        const user = await userModel.findOne({email: req.body.email}).select("+password");
        if(!user) return res.status(401).json({error: "User not found"});
        const isPasswordMatch = await user.comparePassword(req.body.password);
        if(!isPasswordMatch) return res.status(401).json({error: "Invalid Password"});
        const token =  user.generateToken();
        res.cookie("token", token);
        res.status(200).json({user, token});      
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

export const profileUserController = async (req,res) => {
     console.log(req.user);
     res.status(200).json({user: req.user});
}


export const logoutUserController = async (req,res) => {
    try{
        const token = req.cookies.token || req.header.authorization.split(" ")[1];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.clearCookie('token');
        res.status(200).json({message: "Logout successful"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}