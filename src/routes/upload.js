import { Router } from "express";

import * as uploadController from "../controllers/uploadController.js";
import { multerUpload } from "../function/multerFunc.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/upload', route);

    route.get('/myProfile', jwt, uploadController.myProfile);
    route.post('/test', multerUpload.single('img'), uploadController.test);
}

// multerUpload.single('img'), 