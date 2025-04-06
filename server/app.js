import express from "express";
import morgan from "morgan";
import connectToMongoDB from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectToMongoDB();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/messages", messageRoutes);

export default app;
