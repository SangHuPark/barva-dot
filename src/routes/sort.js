import { Router } from "express";

import * as sortController from "../controllers/sortController.js";
import jwt from "../middlewares/jwt.js"; 

const route = Router();

export default async (app) => {
    app.use('/sort', jwt, route);

    route.get('/newestCheckerboard', sortController.newestCheckerboard);
    route.get('/newestSingle', sortController.newestSingle);
    route.post('/genderCheckerboard', sortController.genderCheckerboard);
    route.post('/genderSingle', sortController.genderSingle);
}