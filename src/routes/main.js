import { Router } from "express";

import * as mainController from "../controllers/mainController.js";
import jwt from "../middlewares/jwt.js"; 
import { awsUpload } from "../function/multer.js";

const route = Router();

export default async (app) => {
    app.use('/main', jwt, route);

    route.get('/myProfile', mainController.myProfile);
    route.post('/setProfileImg', awsUpload.single('img'), mainController.setProfileImg);
    route.post('/setProfileIntro', mainController.setProfileIntro);
    route.post('/uploadPost', awsUpload.array('img'), mainController.uploadPost);
    route.get('/userCheckerboard', mainController.userCheckerboard);
    route.get('/userSingle', mainController.userSingle);
}