// //in this file we will make our server listen

// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js"
// import postRoute from "./routes/post.route.js"
// import messageRoute from "./routes/message.route.js"
// import { app,server } from "./socket/socket.js";
// import path from "path";


// dotenv.config({}) //this will always remain on top 

// // const app=express();
// const PORT=process.env.PORT ||3000;

// const __dirname=path.resolve();

// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"I am coming from backend",
//         success:true
//     })
// })
// //Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(urlencoded({extended:true}));

// app.use(express.static(path.join(__dirname,"/frontend/dist")));
// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
// })

// const corsOptions={
//     //this is the origin of frontend ,we will be using react vite and it's port number is 5173
//     origin:'http://localhost:5173',
//     credentials:true
// }
// app.use(cors(corsOptions));

// //here our api will come
// app.use("/api/v1/user",userRoute);//http://localhost:8000/api/v1/user/register etc
// app.use("/api/v1/post",postRoute);
// app.use("/api/v1/message",messageRoute);


// server.listen(PORT,()=>{
//     connectDB()
//     console.log(`Server is running on ${PORT}`);
// })
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
 
dotenv.config();


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin:process.env.URL,
    credentials: true
}
app.use(cors(corsOptions));

// yha pr apni api ayengi
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})
 

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});