import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProjectModel from "./models/project.model.js";
import User from "./models/user.model.js";
import { saveMessage } from "./services/message.service.js";
import cors from "cors";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// app.use(
//   cors({
//     origin: (_, callback) => {
//       callback(null, true); // Allow all origins
//     },
//     credentials: true,
//   })
// );

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("invalid projectId"));
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return next(new Error("Project not found"));
    }

    if (!token) {
      return next(new Error("Authorization Error "));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authorization Error"));
    }

    socket.project = project; // Assign the fetched project to socket.project
    socket.user = decoded; // Assign the decoded user to socket.user
    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  console.log("a user is connected from server");
  socket.join(socket.project._id.toString());

  socket.on("project-message", async (data) => {
    try {
      const sender = await User.findById(data.sender);

      // Save the message to the database with encryption
      await saveMessage({
        roomId: socket.project._id,
        senderId: data.sender,
        message: data.message,
      });

      const messageWithEmail = {
        ...data,
        senderEmail: sender.email,
      };

      socket.broadcast
        .to(socket.project._id.toString())
        .emit("project-message", messageWithEmail);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
