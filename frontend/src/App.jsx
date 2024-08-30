import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Signup from "./components/Signup";
//React router dom It allows us to handle navigation and rendering of components based on the URL path. Basically it helps us to handle multiple pages simultaneously

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes> <MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element:  <ProtectedRoutes> <Profile /></ProtectedRoutes>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>,
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const {socket} =useSelector(store=>store.socketio);
  const dispatch = useDispatch();

  //to receive socket.io from server we have to make our frontend listen
  //useEffect in a React component to work with Socket.IO,  setting up a connection to a server when component starts up and making sure to close that connection when the component is no longer needed.
  useEffect(() => {
    if (user) {
      //connecting frontend to backend
      //query used for sending User id to backend
      //transports:to stop unneccessary  api calls
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      //listening all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      //for realTime notification
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification));
      }) 

      //clean Up
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    //if no user
    else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
