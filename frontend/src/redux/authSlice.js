// all user information will be in this file
import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[], //it will be an array since there will be multiple users
        userProfile:null,//since ever user will have different file
        selectedUser:null,//to whom we will chat
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload;
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        }
    }
})
export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser}=authSlice.actions;
export default authSlice.reducer;