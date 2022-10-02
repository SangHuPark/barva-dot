import { Router } from "express";

import * as feedController from "../controllers/feedController.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/home', route);

    route.get('/myProfile', jwt, feedController.myProfile);
}