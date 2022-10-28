import { Router } from "express";

import * as userController from "../controllers/userController.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/user', jwt, route);

    route.get('/myProfile', userController.myProfile);
    route.get('/myFollowerList', userController.myFollowerList);
    route.get('/myFollowingList', userController.myFollowingList);
    route.post('/setProfileIntro', userController.setProfileIntro);
    route.get('/userCheckerboard', userController.userCheckerboard);
    route.get('/userSingle', userController.userSingle);
    route.post('/savePost', userController.savePost);
    route.post('/cancelSavePost', userController.cancelSavePost);
    route.post('/addFollowing', userController.addFollowing);
    route.post('/cancelFollowing', userController.cancelFollowing);
    route.get('/savePostCheckerboard', userController.savePostCheckerboard);
    route.get('/savePostSingle', userController.savePostSingle);
}