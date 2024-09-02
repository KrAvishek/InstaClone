import React, { useEffect, useState } from "react";
import { Input } from './ui/input'
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import "../index.css";


const Signup=()=>{
    const [input,setInput]=useState({
        username:"",
        email:"",
        password:""
    });
    const [loading,setLoading]=useState(false);
    const {user}=useSelector(store=>store.auth); 
    const navigate=useNavigate();
        const changeEventHandler=(e)=>{
        //jismein change chiye usko rakh rhe aur baki sab same rakh rhe
        setInput({...input,[e.target.name]:e.target.value});
    }

    const signupHandler=async(e)=>{
        e.preventDefault();//so that when we refresh,we don't have to begin from start
        console.log(input);
        try {
            setLoading(true);
            //Axios is a promise-based HTTP library that lets developers make requests to either their own server or a third-party server to fetch data. It offers different ways of making requests such as GET , POST , PUT/PATCH , and DELETE .
            //Input is the data being sent to the server in the body of the POST request. It's typically an object containing user information for registration.
            const res=await axios.post('https://instaclone-bp7h.onrender.com/api/v1/user/register',input,{
                //The headers object contains key-value pairs that represent the headers sent with the request.
                //The Content-Type header tells the server what type of data is being sent in the request body. In this case, 'application/json' indicates that the request body is JSON-formatted.
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true//tells Axios to include credentials (like cookies, authorization headers, etc.) in cross-origin requests.
            });
            if(res.data.success){
                navigate("/login");
                toast.success(res.data.message);//tells Axios to include credentials (like cookies, authorization headers, etc.) in cross-origin requests.
                setInput({
                    username:"",
                    email:"",
                    password:""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(user){
          navigate("/");
        }
      },[]);
    return(
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="my-4">
                <h1 className='my-5 text-center font-weight:600 text-4xl' style={{ fontFamily: 'insta_font' }}>Instagram</h1>
                    <p className="text-small text-center p-1">Sign-up to see photos & videos from your friends </p>
                </div>
                <div>
                    <span className="font-medium">Username</span>
                    <Input 
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2" />
                </div>
                <div>
                    <span className="font-medium">Email </span>
                    <Input 
                    type="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"/>
                </div>
                <div>
                    <span className="font-medium">Password </span>
                    <Input 
                    type="password"
                    name='password'
                    value={input.password}
                    onChange={changeEventHandler}
                    className="focus-visible:ring-transparent my-2"/>
                </div>
                {
                    loading?(
                        <Button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        </Button>
                    ):( <Button type="submit" className="bg-blue-500 font-semibold" >Sign up</Button>)
                }
                <span className="text-center">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
            </form>
         </div>
    )
}

export default Signup;