//this files is for getting all messages
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser}=useSelector(store=>store.auth);//since only selectedUser msg should be displayed
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`https://instaclone-bp7h.onrender.com/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                if (res.data.success) { 
                    // console.log(res.data);
                 dispatch(setMessages(res.data.messages));//if we get success then we will dispatch the setMessage action
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser]);//array dependency
};  
export default useGetAllMessage;
