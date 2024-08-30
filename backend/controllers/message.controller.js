//for chatting
import {Conversation} from "../models/conversation.model.js";
import {Message} from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const {textMessage:message}=req.body;
        // console.log(message);

        //finding where the two participation have any previous conversation bw them
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })
        //establish the conversation if not started
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage=await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        //we are using promise since we have to handle multiple documents at once
        await Promise.all([conversation.save(),newMessage.save()]);

        //implements socket.io for real time data transfer
        // we have to know the receiver's socket id to send message to them
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            //to means where we have to send
            io.to(receiverSocketId).emit('newMessage',newMessage);
        } 

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
};
//get message

export const getMessage=async(req,res)=>{
    try {
        const senderId=req.id;
        const receiverId=req.params.id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]} 
        }).populate('messages');
        if(!conversation){
            return res.status(200).json({success:true,messages:[]});
        }
        return res.status(200).json({success:true,messages:conversation?.messages});

    } catch (error) {
        console.log(error);
    }
};