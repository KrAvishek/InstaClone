//implement the socket.io functionalities fro checking whether the user is online or offline npm i socket.io
//first we have to create HTTP SERVER

import {Server} from 'socket.io';
import express from "express";
import http from "http";

const app=express();

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})
//this map stores socket.id corresponding to user.id;
//so we will see which user have socketId those user which will have socket id will be online
const userSocketMap={};

export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId];

io.on('connection',(socket)=>{
    const userId=socket.handshake.query.userId;
    //if anyone has usedId then it means user is online
    if(userId){
        userSocketMap[userId]=socket.id;
        // console.log(`User Connected:UserId= ${userId},SocketId=${socket.id}`);
    }

    // emit is a method used to send or broadcast events to connected clients or a specific client(frontend)
    //getOnlineUsers is the event here
    //userSocketMap is the data  send along with the event. Object.keys(userSocketMap) is being sent, which is an array of user IDs representing the currently online users.
    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        if(userId){
            // console.log(`User Connected:UserId= ${userId},SocketId=${socket.id}`);
            delete userSocketMap[userId];//if a user will be disconnected then will delete the id of the user   
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    });
})

export {app,server,io};