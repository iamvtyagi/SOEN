import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [4, "Email must be at least 4 characters long"],
        maxlength: [50, "Email must be at most 50 characters long"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
          ]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

userSchema.methods.hashpassword = async function (password){
     const saltRound = 15;
     const salt = await bcrypt.genSalt(saltRound);
     const hash = await bcrypt.hash(password, salt);
     return hash;
}

userSchema.methods.comparePassword = async function (password){
    // this.password is the hashed password in the database
    // password is the password which is entered by the user
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({
        id: this._id,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;