import { Router } from "express";

import auth from "./auth.js";
import upload from "./upload.js";

export default () => {
    const app = Router();

    auth(app);
    upload(app);

    return app;
}