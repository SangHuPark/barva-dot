import { Router } from "express";

import * as userController from "../controllers/userController.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/user', jwt, route);

    route.get('/myProfile', userController.myProfile);
    route.post('/setProfileIntro', userController.setProfileIntro);
    route.get('/userCheckerboard', userController.userCheckerboard);
    route.get('/userSingle', userController.userSingle);
    route.post('/savePost', userController.savePost);
}