import { Router } from "express";

import * as uploadController from "../controllers/uploadController.js";
import { awsUpload } from "../function/multerFunc.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/upload', route);

    route.get('/myProfile', jwt, uploadController.myProfile);
    route.post('/test', awsUpload.single('img'), uploadController.test);
    route.post('/array', awsUpload.array('img'), uploadController.array);
    route.get('/import', uploadController.send);
}