import { Router } from "express";

import * as uploadController from "../controllers/uploadController.js";
import jwt from "../middlewares/jwt.js"; 
import { awsUpload } from "../function/multer.js";

const route = Router();

export default async (app) => {
    app.use('/upload', jwt, route);

    route.post('/setProfileImg', awsUpload.single('img'), uploadController.setProfileImg);
    route.post('/uploadPost', awsUpload.array('img'), uploadController.uploadPost);
    route.post('/commentPost', uploadController.commentPost);
    route.post('/commentList', uploadController.commentList);
    route.post('/likePost', uploadController.likePost);
    route.post('/cancelLikePost', uploadController.cancelLikePost);
}