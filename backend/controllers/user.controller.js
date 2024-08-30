import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";

//in this file we will have all the user's sign-in, registration,log out
export const register =async(req,res)=>{
    try{
        const {username,email,password} =req.body;//req.body means the form user is submitting we will get
        if(!username || !email || !password){
            return res.status(401).json({
                message:"Something is missing,please check!",
                success:false,
            });
        }
        const user=await User.findOne({email});//we are finding user from schema model
        if(user){
            return res.status(401).json({
                message:"Try Different email id.",
                success:false,
            });
        };

        //for security purposes we have put salt value=10
        const hashedPassword= await bcrypt.hash(password,10)
        //below are the things what are required in the user model
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message:"Account created successfully",
            success:true,
        });
    }
    catch(error){
        console.log(error);
    }
}
export const login=async(req,res)=>{
    try{
        const {email,password} =req.body;//req.body means the form user is submitting we will get
        if(!email || !password){
            return res.status(401).json({
                message:"Something is missing,please check!",
                success:false,
            });
        }
        let user=await User.findOne({email});
        //if user doesn't exist
        if(!user){
            return res.status(401).json({
                message:"Incorrect email or password.",
                success:false,
            });
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message:"Incorrect email or password.",
                success:false,
            });

        };
         //Now we will generate token to see whether the user is authenticated or not
        //in mongo db the user id is represented as _id
        const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

        //populate each post in the posts array
        //we can use map fn as we have to iterate for every post id,
        //using async since it is a callback function
        //if we won't did promise.all then we have to use await for each user  
        const populatedPosts=await Promise.all(
            user.posts.map(async(postId)=>{
                const post=await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        }
       
        return res.cookie("token",token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
            message:`Welcome ${user.username}`,
            success:true,
            user 
            //here user is returned so that we can save it in our frontend 
        });
    }
    catch(error){
        console.log(error);
    }
};

//we don't need any req so empty
export const logout=async (_,res)=>{
   try {
        //now we are deleting the token that's why empty ""
        return res.cookie("token","",{maxAge:0}).json({
            message:'Logged out successfully.',
            success:true,
        })
   } catch (error) {
    console.log(error);
   }  
};

export const getProfile=async (req,res)=>{
    try {
        const userId=req.params.id;
        let user=await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks');
        return res.status(200).json({ 
            user,
            success:true
        });
                
    } catch (error) {
     console.log(error);
    }  
 };

 //the user which is logged in can only edit profile
 //so,we are having the id from the token ,process is in isAuthenticated.js
 export const editProfile=async (req,res)=>{
    try {
        const userId=req.id;//we have stored above all the user's logged in userId
        const  {bio,gender}=req.body;
        const profilePicture=req.file;//Image comes from the file
        let cloudResponse;
         
        //for this profilePicture we have to make a getDataUri
        if(profilePicture){
            const fileUri=getDataUri(profilePicture);//this function will convert the uri into file uri 
            //now this fileUri can be uploaded in cloudinary but first we have to setUp cloudinary
           cloudResponse= await cloudinary.uploader.upload(fileUri);
        }
        const user=await User.findById(userId).select('-password');
        if(!user){
           return res.status(404).json({
            message:"User not found",
            success:false
           })
        };
        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;

        await user.save();//everything will be saved in the database
        return res.status(200).json({
            message:"Profile Updated",
            success:true,
            user
           })
    } catch (error) {
     console.log(error);
    }  
 };

 export const getSuggestedUsers=async(req,res)=>{
    try {
        //ne:not equal 
        //Below is MongoDB query to retrieve data from a collection named User.
        //-password:as we dont need password
        const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message:"Currently doesn't have any users",
            })
        };
        return res.status(200).json({
            success:true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log(error);
    };
 }

 export const followOrUnfollow=async(req,res)=>{
    try {
        const followKrneWala=req.id;//rakesh
        const jiskofollowkrenge=req.params.id;//sarika
        if(followKrneWala === jiskofollowkrenge){
            return res.status(400).json({
                message:"You cannot follow or unfollow yourself",
                success:false
            });
        }
        const user=await User.findById(followKrneWala);
        const targetUser=await User.findById(jiskofollowkrenge);

        if(!user || !targetUser){
            return res.status(400).json({
                message:"User not found",
                success:false
            });
        }
        //checking whether to follow or unfollow
        const isFollowing=user.following.includes(jiskofollowkrenge);
        if(isFollowing){
            //Now we can unfollow only
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$pull:{following:jiskofollowkrenge}}),
                User.updateOne({_id:jiskofollowkrenge},{$pull:{following:followKrneWala}}),
            ])
            return res.status(200).json({message:"Unfollowed successfully",success:true});
        }
        else{
            //else follow
            //whenever we handle two documents we use promise here user and targetUser 
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$push:{following:jiskofollowkrenge}}),
                User.updateOne({_id:jiskofollowkrenge},{$push:{followers:followKrneWala}}),
            ])
            return res.status(200).json({message:"Followed successfully",success:true});
        }
    } catch (error) {
        console.log(error);
    }
 }