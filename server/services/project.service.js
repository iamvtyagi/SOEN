import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({
    name , userId
}) => {
    if(!name || !userId) throw new Error("Name and userId are required");

    const project = new projectModel({ name, users: [userId] });
    await project.save();
    return project;
}

export const getAllProjectsByUserId = async (userId) =>  {
    if(!userId) throw new Error("userId is required");

    const allUserProjects = await projectModel.find({ users: userId });
    return allUserProjects;
} 

export const addUserToProject = async ({projectId, users, userId}) => {

    if(!projectId) throw new Error("projectId is required");
    if(!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid projectId");


    if(!users) throw new Error("users is required");
    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("users should be an array of valid userIds");
    }  

    if(!userId) throw new Error("userId is required");
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");
    
    const project = await projectModel.findById({
        _id: projectId,
        users : userId
    });

  if(!project) throw new Error("Project not found or user n ot authorized");

  const updatedProject = await projectModel.findByIdAndUpdate({
    _id : projectId
  },{
    $addToSet : {
        users : {
            $each : users
        }
    }
  }, { 
    new : true  
  })

  return updatedProject;
}



export const getProjectByIdService = async ({projectId}) => {
   if( !projectId ){
    throw new Error("projectId is required ");
   }

   if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error("invalid projectId ")
   }
  

   const project = await projectModel.findOne({
       _id : projectId
   }).populate('users')

   return project

}