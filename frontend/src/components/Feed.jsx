// import React from 'react'
// import Posts from './Posts'

// const Feed = () => {
//   return (
//     <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'><Posts /></div>
//   )
// }

// export default Feed;

import React from 'react';
import Posts from './Posts';
import Stories from './Stories';  

const Feed = () => {
  return (
    <div>
      <Stories />
    <div className='flex-1 flex flex-col items-center pl-[20%] '>
       {/* Add Stories at the top */}
      <Posts />
    </div>
    </div>
  );
};

export default Feed;
