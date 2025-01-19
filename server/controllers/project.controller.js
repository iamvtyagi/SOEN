import projectModel from "../models/project.model.js";
import {createProject} from "../services/project.service.js";
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