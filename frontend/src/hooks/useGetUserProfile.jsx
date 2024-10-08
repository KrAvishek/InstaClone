import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile,setUserProfile]=useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://instaclone-bp7h.onrender.com/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);//(array dependedncy)it means whenever userId will be change then the useEffect will be called
};
export default useGetUserProfile;