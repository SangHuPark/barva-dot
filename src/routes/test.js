import { Router } from "express";

import * as testController from "../controllers/testController.js";
import jwt from "../middlewares/jwt.js"; 
import { awsUpload } from "../function/s3-multer.js";

const route = Router();

export default async (app) => {
    app.use('/test', jwt, route);

    route.post('/post', awsUpload.array('img'), testController.insertColor);
    route.post('/colorCheck', testController.colorCheckerboard);
    route.post('/colorSingle', testController.colorSingle);
}