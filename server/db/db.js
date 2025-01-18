import mongoose from "mongoose";

// console.log(process.env.MONGO_URL);

function connectToMongoDB() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(err);
    });
}

export default connectToMongoDB;