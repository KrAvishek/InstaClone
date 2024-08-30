import React from 'react'
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {
  return (
    <div><LeftSidebar />
        <div>
            <Outlet />  
            {/* IT IS USED TO RENDER THE CHILDREN  */}
        </div> 
    </div>
  )
}

export default MainLayout;