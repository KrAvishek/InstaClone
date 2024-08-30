// import React from 'react'
// import Feed from './Feed'
// import { Outlet } from 'react-router-dom'
// import RightSidebar from './RightSidebar'
// import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
// import useGetAllPost from '@/hooks/useGetAllPost'

// const Home = () => {
//   useGetAllPost();
//   useGetSuggestedUsers();
//   return (
//     <div className='flex'>
//         <div className='flex-grow'>
//             <Feed />
//             <Outlet />
//         </div>
//      <RightSidebar />    
//     </div>
//   )
// }

// export default Home

import React, { useEffect } from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

// Combined useGetAllPost function
const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/post/all', { withCredentials: true });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, [dispatch]); // Ensure dispatch is included in dependency array
};

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />    
    </div>
  );
};

export default Home;
