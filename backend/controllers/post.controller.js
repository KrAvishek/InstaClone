import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import {Comment} from "../models/comment.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost=async(req,res)=>{
    try {
        const {caption}=req.body;//while posting on insta we used to give caption
        const image=req.file;
        const authorId=req.id;

        if(!image){
            return res.status(400).json({message:'Image required'});
        }
        //image upload
        //will use npm sharp for large images in common formats to smaller
        const optimizedImageBuffer=await sharp(image.buffer)
        .resize({width:800,height:800,fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer();

        //to convert buffer into data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse=await cloudinary.uploader.upload(fileUri);
        const post=await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });
        //whenever new post will be added,it should be added in user (Check user.models)
        const user=await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        //populate is a method in mongodb from this we can have all the data of a specific user via user id
        await post.populate({path:'author',select:'-password'});
        
        return res.status(201).json({
            message:'New post added',
            post,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

//Now getting all posts in the feed

export const getAllPost=async(req,res)=>{
    try {
        //we wanted the the newer posts to be at first 
        //and after that in comments we will sort according to the latest comments
        const posts=await Post.find().sort({createdAt:-1})
        .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

//To know user posts in the user post(profile) section
export const getUserPost=async(req,res)=>{
    try {
        //since we need user id ,we saved it during the authentication
        const authorId=req.id;
        const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username profilePicture'
        })
        .populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })

    } catch (error) {
        console.log(error);
        
    }
};

//for liking the post:
export const likePost=async(req,res)=>{
    try {
        const likeKrneWalaUserKiId=req.id;
        const postId=req.params.id;//when we will integrate the api then we will send this id into that
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:'Post not found.',success:false});
        }
        //like logic (now we will check in the post.model we have )
        // addToSet query will act as hash set ,as single user can make count of 1 like only
        await post.updateOne({$addToSet:{likes:likeKrneWalaUserKiId}});
        await post.save();

        //implement socet.io for real time notification as whenever someone likes the post ,notification will come to that user
        const user=await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        //when user likes his post then no need for the notification 
        const postOwnerId=post.author.toString();//it will be in the format of Object
        if(postOwnerId !== likeKrneWalaUserKiId){
            //emit a notification event
            const notification={
                type:"like",
                userId:likeKrneWalaUserKiId,
                userDetails:user,
                postId,
                message:'Your post was liked!'
            }
            //to send owner the notification when someone likes the post
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({message:'Post Liked',success:true})
    } catch (error) {
        console.log(error);
    }
};

//for disliking the position:
export const dislikePost=async(req,res)=>{
    try {
        const likeKrneWalaUserKiId=req.id;
        const postId=req.params.id;//when we will integrate the api then ww will send this id into that
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:'Post not found.',success:false});
        }
        //like logic (now we will check in the post.model we have )
        //pull method is used for deleting the like
        await post.updateOne({$pull:{likes:likeKrneWalaUserKiId}});
        await post.save();

        //implement socet.io for real time notification as whenever someone likes the post ,notification will come to that user
            
             const user=await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
             //when user likes his post then no need for the notification 
             const postOwnerId=post.author.toString();//it will be in the format of Object
             if(postOwnerId !== likeKrneWalaUserKiId){
                 //emit a notification event
                 const notification={
                     type:"dislike",
                     userId:likeKrneWalaUserKiId,
                     userDetails:user,
                     postId,
                     message:'Your post was liked!'
                 }
                 //to send owner the notification when someone likes the post
                 const postOwnerSocketId=getReceiverSocketId(postOwnerId);
                 io.to(postOwnerSocketId).emit('notification',notification);
             }

        return res.status(200).json({message:'Post Disliked',success:true})
    } catch (error) {
        console.log(error);
    }
}

//To add a comment
export const addComment=async(req,res)=>{
    try {
        //we need post's id to add the comment
        const postId=req.params.id;
        const commentKrneWalaUserKiId=req.id;

        const {text}=req.body;
        const post=await Post.findById(postId);
        if(!text){
            return res.status(400).json({message:'text is required',success:false});
        }
        const comment=await Comment.create({
            text,
            author:commentKrneWalaUserKiId,
            post:postId
        })
        
            await comment.populate({
                path:"author",
                select:"username profilePicture"

        });
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

//as all post have their own comment 

export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const comments=await Comment.find({post:postId}).populate('author', 'username profilePicture');
        if(!comments){
          return res.status(404).json({message:"No comment found for this post",success:false});  
        }
        return res.status(200).json({success:true,comments});
    } catch (error) {
        console.log(error);
    }
};

//To delete a post
export const deletePost=async(req,res)=>{
    try{
        const postId=req.params.id;
        const authorId=req.id;

        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found",success:false});
        }
        //check if the logged in user is the owner of the post
        //toString() since,default it is in object form and we need to convert it to the string to compare
        if(post.author.toString()!== authorId){
            return res.status(403).json({message:"Unauthorized!"});  
        }
        //delete post
        await Post.findByIdAndDelete(postId);
        //remove the post id from the user's post
        let user=await User.findById(authorId);
        user.posts=user.posts.filter(id=>id.toString()!==postId);
        await user.save();

        //delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:"Post Deleted"
        })
    }
    catch(error){
        console.log(error);
    }
};

//To bookmark a post
export const bookmarkPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found",success:false});
        }
        const user=await User.findById(authorId);
        //if a user already has bookmark means a post can be bookmarked only once
        if(user.bookmarks.includes(post._id)){
            //remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved',message:'Post removed from bookmark',success:true});
        }
        else{
            //bookmark the post
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved',message:'Post bookmarked',success:true});
        }
    } catch (error) {
        console.log(error);
    }
};