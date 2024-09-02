// import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
// import React, { useState } from 'react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setAuthUser } from '@/redux/authSlice'
// import CreatePost from './CreatePost'
// import { setPosts, setSelectedPost } from '@/redux/postSlice'
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
// import { Button } from './ui/button'



// const LeftSidebar = () => {
//     const navigate=useNavigate();
//     //we use useSelector to get any value from store
//     const {user}=useSelector(store=>store.auth);
//     const {likeNotification}=useSelector(store=>store.realTimeNotification);
//     const dispatch=useDispatch();
//     const [open,setOpen]=useState(false);

//     const logoutHandler=async () =>{
//         try {
//             const res=await axios.get('https://instaclone-bp7h.onrender.com/api/v1/user/logout',{withCredentials:true});
//             if(res.data.success){
//                 dispatch(setAuthUser(null));  
//                 dispatch(setSelectedPost(null));
//                 dispatch(setPosts([]));
//                 navigate("/login");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             toast.error(error.response.data.message);
//         }
//     }
//     // const createPostHandler=()=>{
//     //     setOpen(true);
//     // }
//     //this fn will tell what we will happen if any text(Home,search,...,etc) when got clicked
//     const sidebarHandler=(textType)=>{
//         if(textType ==='Logout') {
//             logoutHandler();
//         }
//         else if(textType==='Create'){
//             setOpen(true);
//         }
//         else if(textType==='Profile'){
//             navigate(`/profile/${user?._id}`);
//         } 
//         else if(textType==='Home'){
//             navigate(`/`);
//         }
//         else if(textType==='Messages'){
//             navigate(`/chat`);
//         }

//     }

//     const sidebarItems=[
//         {icon:<Home />,    text:"Home"},
//         {icon:<Search />,    text:"Search"},
//         {icon:<TrendingUp />,    text:"Explore"},
//         {icon:<MessageCircle />,    text:"Messages"},
//         {icon:<Heart />,    text:"Notifications"},
//         {icon:<PlusSquare />,    text:"Create"},
//         {icon:(
//             <Avatar className='w-6 h-6'>
//             <AvatarImage src={user?.profilePicture} alt="@shadcn" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>),    text:"Profile"},
//          {icon:<LogOut />,    text:"Logout"},
//     ] 
//     return (
//         <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
//             <div className='flex flex-col'>
//                 <h1 className='my-7 pl-3 font-cursive font-extrabold text-3xl'>Instagram</h1>
//                 <div>
//                     {
//                         sidebarItems.map((item, index) => {
//                             return (
//                                 <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
//                                     {item.icon}
//                                     <span>{item.text}</span>
//                                     {
//                                         item.text === "Notifications" && likeNotification.length > 0 && (
//                                             <Popover>
//                                                 <PopoverTrigger asChild>
//                                                     <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
//                                                 </PopoverTrigger>
//                                                 <PopoverContent>
//                                                     <div>
//                                                         {
//                                                             likeNotification.length === 0 ? (<p>No new notification</p>) : (
//                                                                 likeNotification.map((notification) => {
//                                                                     return (
//                                                                         <div key={notification.userId} className='flex items-center gap-2 my-2'>
//                                                                             <Avatar>
//                                                                                 <AvatarImage src={notification.userDetails?.profilePicture} />
//                                                                                 <AvatarFallback>CN</AvatarFallback>
//                                                                             </Avatar>
//                                                                             <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
//                                                                         </div>
//                                                                     )
//                                                                 })
//                                                             )
//                                                         }
//                                                     </div>
//                                                 </PopoverContent>
//                                             </Popover>
//                                         )
//                                     }
//                                 </div>
//                             )
//                         })
//                     }
//                 </div>
//             </div>

//             <CreatePost open={open} setOpen={setOpen} />

//         </div>
//     )
// }

// export default LeftSidebar

import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { clearLikeNotifications } from '@/redux/rtnSlice';
import '../index.css'; 

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false); // State to track popover visibility
    const [activeButton, setActiveButton] = useState(null); // Track active button

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://instaclone-bp7h.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));  
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === 'Create') {
            setOpen(true);
        } else if (textType === 'Profile') {
            navigate(`/profile/${user?._id}`);
        } else if (textType === 'Home') {
            navigate(`/`);
        } else if (textType === 'Messages') {
            navigate(`/chat`);
        }
        // Set the clicked button as active, except for Search and Explore
        if (textType !== 'Search' && textType !== 'Explore') {
            setActiveButton(textType);
        }
    };

    useEffect(() => {
        let timer;
        if (popoverOpen) {
            timer = setTimeout(() => {
                dispatch(clearLikeNotifications()); // Clear notifications after 5 seconds
                setPopoverOpen(false); // Close the popover after clearing notifications
            }, 5000); // 5 seconds
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [popoverOpen, dispatch]);

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="User Profile" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen '>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 text-2xl' style={{ fontFamily: 'insta_font' }}>
                    Instagram
                </h1>

                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            key={index}
                            className={`flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-3 
                            ${item.text === activeButton ? 'bg-gray-950 text-white' : 'hover:bg-gray-100'}
                            ${item.text === 'Search' || item.text === 'Explore' ? '' : ''}`}
                        >
                            {item.icon}
                            <span>{item.text}</span>
                            {item.text === "Notifications" && likeNotification.length > 0 && (
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
                                            {likeNotification.length}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div>
                                            {likeNotification.length === 0 ? (
                                                <p>No new notifications</p>
                                            ) : (
                                                likeNotification.map((notification, index) => (
                                                    <div key={`${notification.userId}-${index}`} className='flex items-center gap-2 my-2'>
                                                        <Avatar>
                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className='text-sm'>
                                                            <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
}

export default LeftSidebar;
