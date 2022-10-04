import { Router } from "express";

import * as authController from "../controllers/authController.js";
import jwt from "../middlewares/jwt.js";

const route = Router();

export default async (app) => {
    app.use('/auth', route);

    route.post('/login', authController.login);
    route.post('/signup', authController.signUp);
    route.post('/isExistId', authController.isExistId);
    route.post('/isExistNick', authController.isExistNick);
    route.post('/sendMail', authController.sendMail);
    route.post('/authMail', authController.authMail);
    route.post('/findId', authController.findId);
    route.post('/findPw', authController.findPw);
    route.post('/findPwMail', authController.findPwMail);
    route.put('/updatePw', authController.updatePw);
    route.delete('/resign', jwt, authController.resign);
}