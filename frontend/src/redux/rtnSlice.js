// //For real time notification
// import { createSlice } from "@reduxjs/toolkit";

// const rtnSlice=createSlice({
//     name:'realTimeNotification',
//     initialState:{
//         likeNotification:[],
//     },
//     reducers:{
//         //user can like or dislike the msg so whenever user likes the msg then we will push 
//         setLikeNotification:(state,action)=>{
//             if(action.payload.type==='like'){
//                 state.likeNotification.push(action.payload);
//             }
//             else if(action.payload.type==='dislike'){
//                 state.likeNotification=state.likeNotification.filter((item)=>item.userId!==action.payload.user);
//             }
//         }
//     }
// })
// export const {setLikeNotification}=rtnSlice.actions;
// export default rtnSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
        commentNotification: [], // New state for comment notifications
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (!Array.isArray(state.likeNotification)) {
                state.likeNotification = [];
            }
            if (action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            } else if (action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        },
        setCommentNotification: (state, action) => {
            if (!Array.isArray(state.commentNotification)) {
                state.commentNotification = [];
            }
            if (action.payload.type === 'comment') {
                state.commentNotification.push(action.payload);
            } else if (action.payload.type === 'removeCommentNotification') {
                state.commentNotification = state.commentNotification.filter(
                    (item) => item.commentId !== action.payload.commentId
                );
            }
        },
        clearLikeNotifications: (state) => {
            state.likeNotification = [];
        },
        clearCommentNotifications: (state) => {
            state.commentNotification = [];
        }
    }
});

export const { 
    setLikeNotification, 
    setCommentNotification, 
    clearLikeNotifications, 
    clearCommentNotifications 
} = rtnSlice.actions;
export default rtnSlice.reducer;

