import projectModel from "../models/project.model.js";
import {createProject, getAllProjectsByUserId} from "../services/project.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";

export const createProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try{
    const name = req.body.name;
    const loggedInUser = await userModel.findOne({email: req.user.email});
    const userId = loggedInUser._id;
 
    const newProject = await createProject({ name, userId });
    res.status(201).json({ project: newProject });
  }catch(err){
    res.status(500).json({error: err.message});
  }

}

export const getAllProjectsController = async (req, res) => {
    try{

      const loggedInuser = await userModel.findOne({email: req.user.email});

      const allUserProjectets = await  getAllProjectsByUserId(loggedInuser._id);

      return res.status(200).json({projects: allUserProjectets});


    }catch(err){
      console.log(err);
      res.status(400).json({error: err.message});
    }

}

export const addUserToProjectController = async (req,res) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
     try{

      
         
     }catch(err){
         console.log(err);
         res.status(400).json({error: err.message});
     }
}