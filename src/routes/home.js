import { Router } from "express";

import * as homeController from "../controllers/homeController.js";
import { awsUpload } from "../function/multerFunc.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/upload', route);

    route.get('/myProfile', jwt, homeController.myProfile);
    route.post('/setProfileImg', jwt, awsUpload.single('img'));
    route.post('/setProfileIntro', jwt, )
    route.post('/test', awsUpload.single('img'), homeController.test);
    route.post('/array', awsUpload.array('img'), homeController.array);
    route.get('/import', homeController.send);
}