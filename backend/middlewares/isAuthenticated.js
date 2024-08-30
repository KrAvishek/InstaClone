import jwt from "jsonwebtoken";

const isAuthenticated=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false
            });
        }
        //we get the token ,now we will verify with the secret key is user authenticated
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid",
                success:false
            });
        }
        req.id=decode.userId;//this usedId we are getting when we have make the token in user.controller.js file
        next();//for further route or further middleware to run
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;