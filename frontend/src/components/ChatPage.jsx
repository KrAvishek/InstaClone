// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { setSelectedUser } from "@/redux/authSlice";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { MessageCircleCode } from "lucide-react";
// import Messages from "./Messages";
// import axios from "axios";
// import { setMessages } from "@/redux/chatSlice";

// const ChatPage = () => {
//   const [textMessage,setTextMessage]=useState("");
//   const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
//   const {onlineUsers,messages}=useSelector(store=>store.chat);
//   // const isOnline = false;
//   const dispatch = useDispatch();

//   const sendMessageHandler=async(receiverId)=>{
//     try {
//       const res=await axios.post(`https://instaclone-bp7h.onrender.com/api/v1/message/send/${receiverId}`,{textMessage},{
//         headers:{
//           'Content-Type':'application/json'
//         },
//         withCredentials:true
//       });
//       if(res.data.success){
//         dispatch(setMessages([...messages,res.data.newMessage]));
//         setTextMessage("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   //FOR CLEANUP USING useEffect

//   useEffect(()=>{
//     return () =>{
//       dispatch(setSelectedUser(null));
//     }
//   },[]);

//   return (
//     <div className="flex ml-[18.5%] h-screen">
//       <section className="w-full md:w-1/4 my-8">
//         <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
//         <hr className="mb-4 border-gray-300 "></hr>
//         <div className="overflow-y-auto h-[80vh]">
//           {
//             suggestedUsers.map((suggestedUser) => {
//             const isOnline=onlineUsers.includes(suggestedUser?._id);
//             return (
//               //we are dispatching the action setSelectedUser in suggestedUser
//               <div
//                 onClick={() => dispatch(setSelectedUser(suggestedUser))}
//                 className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
//               >
//                 <Avatar className="w-14 h-14">
//                   <AvatarImage src={suggestedUser?.profilePicture} />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//                 <div className="flex flex-col">
//                   <span className="font-medium">{suggestedUser?.username}</span>
//                   <span
//                     className={`text-xs font-bold ${
//                       isOnline ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {isOnline ? "Online" : "Offline"}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>
//       {/* we will display the message of a particular user */}
//       {selectedUser ? (
//         <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
//           <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
//             <Avatar>
//               <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span>{selectedUser?.username}</span>
//             </div>
//           </div>
//           {/* Message will come here */}
//           <Messages selectedUser={selectedUser} />
//           <div className="flex items-center p-4 border-t border-t-gray-300">
//             <Input
//             value={textMessage}
//             onChange={(e)=>setTextMessage(e.target.value)}
//               type="text"
//               className="flex-1 mr-2 focus-visible:ring-transparent"
//               placeholder="Messages..."
//             />
//             <Button onClick={()=>sendMessageHandler(selectedUser?._id)}>Send</Button>
//           </div>
//         </section>
//       ) : (
//         <div className="flex flex-col items-center justify-center mx-auto">
//           <MessageCircleCode className="w-32 h-32 my-4" />
//           <h1 className="font-medium text-xl">Your messages</h1>
//           <span>Send a message to start a chat</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    if (textMessage.trim() === "") return; // Prevent sending empty messages
    try {
      const res = await axios.post(
        `https://instaclone-bp7h.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle sending the message when the Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler(selectedUser?._id);
    }
  };

  // Cleanup using useEffect
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex ml-[18.5%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 mr-11  border-gray-300"></hr>
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              // Assign a unique key to each mapped element
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Display the message of a particular user */}
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          {/* Messages will be displayed here */}
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyDown} 
            
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
