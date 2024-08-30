import { v2 as cloudinary } from "cloudinary";//v1 as clodinary means we are changing name of v1 to cloudinary
import dotenv from "dotenv";
dotenv.config({});//so that there would be no problem in receiving data from env

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export default cloudinary;


