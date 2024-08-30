// we are making this file so that we can get posts through hooks
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/post/all', { withCredentials: true });
                if (res.data.success) { 
                    // console.log(res.data);
                 dispatch(setPosts(res.data.posts));//if we get success then we will dispatch the setPost action
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, []);//array dependency
};  
export default useGetAllPost;
