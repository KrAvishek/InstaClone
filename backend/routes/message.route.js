//This is for routes for all the business logics
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { sendMessage,getMessage } from "../controllers/message.controller.js";

const router=express.Router();

//send and receiver's id
router.route('/send/:id').post(isAuthenticated,sendMessage);
router.route('/all/:id').get(isAuthenticated,getMessage);
export default router;
//now we have to attach this file to index.js since there server is listening