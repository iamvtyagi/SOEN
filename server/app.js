import express from "express"; 
import morgan from "morgan";
import connectToMongoDB from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

connectToMongoDB();


const app = express();

app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", userRoutes);

export default app;