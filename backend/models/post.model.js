import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    caption:{type:String,default:''},
    image:{type:String,required:true},//as image is neccessary for posting
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}], //making another model for comments to know which person commented on the post
});
export const Post=mongoose.model("Post",postSchema);