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