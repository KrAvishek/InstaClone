//Making schema of user for database

import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,require:true},
    profilePicture:{type:String,default:''}, //if a user doesn't want to upload profilepic
    bio:{type:String,default:''},
    gender:{type:String,enum:['male','female']},//one of the values specified in the array ['male', 'female']
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],//we are generating relationship of user
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],//We are putting here id so that we get details of other user by id 
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],//here user and post table will have relationship bw them
    bookmarks:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}]


},{timestamps:true});
//timestamps option to true in a schema definition automatically adds createdAt and updatedAt fields to schema. 

export const User=mongoose.model('User',userSchema);// model name:User