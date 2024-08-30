//This is for routes for all the business logics
import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);//since not sending any data
router.route('/:id/profile').get(isAuthenticated,getProfile);//it will first authenticate then it will get the profile
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePhoto'),editProfile)//uploading will be happening via multer middleware
router.route('/suggested').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);

export default router;
//now we have to attach this file to index.js since there server is listening