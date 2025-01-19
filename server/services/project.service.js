import projectModel from "../models/project.model.js";

export const createProject = async ({
    name , userId
}) => {
    if(!name || !userId) throw new Error("Name and userId are required");

    const project = new projectModel({ name, users: [userId] });
    await project.save();
    return project;
}