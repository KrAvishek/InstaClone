import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import "../index.css"; // Ensure this is included

const Story = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className='flex-8 flex flex-col items-center pl-[17%] mt-1.5 relative'>
      {suggestedUsers.length > 7 && (
        <button 
          className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300'
          onClick={handleScrollLeft}
        >
          ←
        </button>
      )}
      <div ref={scrollRef} className='flex overflow-x-auto space-x-4 py-3 px-2 bg-white border-b-0 scrollbar-hide'>
        {suggestedUsers.map((user) => (
          <Link
            to={`/profile/${user._id}`}
            key={user._id}
            className='flex flex-col items-center'
          >
            <div className="relative w-[64px] h-[64px]">
              <Avatar className='w-[64px] h-[64px] p-[2px] bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 rounded-full'>
                <div className="w-full h-full bg-white rounded-full p-[2px]">
                  <AvatarImage src={user.profilePicture} alt={user.username} className="rounded-full" />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </div>
              </Avatar>
            </div>
            <span className='text-xs text-gray-700 mt-2'>{user.username}</span>
          </Link>
        ))}
      </div>
      {suggestedUsers.length > 7 && (
        <button 
          className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300'
          onClick={handleScrollRight}
        >
          →
        </button>
      )}
    </div>
  );
};

export default Story;
