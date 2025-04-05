import 'dotenv/config';
import http from "http";
import app from "./app.js";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'



const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin : '*'
    }
});

 
io.use((socket,next) => {
    
    try{

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];

        if(!token){
             return next(new Error("Authorization Error "))
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

       if(!decoded){
          return next(new Error("Authorization Error"))
       }

       socket.user = decoded
       next();

    }catch(err){
        next(err);
    }
})


io.on('connection', socket => {
     
    console.log("a user is connected from server")

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});



server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});