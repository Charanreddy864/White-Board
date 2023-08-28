const express = require("express");
const socket = require("socket.io");
const cors = require("cors");


const app=express();
// app.use(cors()); 
app.use(express.static("./frontend"));

let port = process.env.PORT || 8080;
 let link = "https://white-board-tau.vercel.app";
let server=app.listen(port,()=>{
    console.log("listening to port " + port);
})

let io = socket(server, {
    cors: {
      origin: link,
      methods: ["GET", "POST"]
    }
});
// let io = socket(server);

io.on("connection",(socket)=>{
    console.log("Made socket connection");
    socket.on("beginpath",(data)=>{
        io.sockets.emit("beginpath",data);
    })
    socket.on("drawstroke",(data)=>{
        io.sockets.emit("drawstroke",data);
    })
    socket.on("performUndoRedo",(data)=>{
        io.sockets.emit("performUndoRedo",data);
    })
})
