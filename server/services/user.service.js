import userModel from "../models/user.model.js";

export const createUser = async ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password are required");

    const user = new userModel({ email, password });
    user.password = await user.hashpassword(password);
    await user.save();
    return user;
}


export const getAllUsers = async ({userId}) => {
    const users = userModel.find({
        _id : {$ne: userId}
    });
    return users;
}