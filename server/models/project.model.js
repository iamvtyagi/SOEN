import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    // name of the project
    name: {
        // String type
        type: String,
        // required field
        required: true,
        // make it lowercase
        lowercase: true,
        // remove any leading or trailing whitespace
        trim: true,
        // make sure the project name is unique in the database
        unique: [true, "Project name must be unique"]
    },
    // an array of users associated with the project
    users: [
        {
            // reference to the User model
            type: mongoose.Schema.Types.ObjectId,
            // the name of the model that this field references
            ref: "User"
        }
    ]
})


const Project = mongoose.model("project", projectSchema);
export default Project;