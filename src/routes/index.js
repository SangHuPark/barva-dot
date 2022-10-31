import { Router } from "express";

import auth from "./auth.js";
import sort from "./sort.js";
import upload from "./upload.js";
import user from "./user.js";
import test from "./test.js";

export default () => {
    const app = Router();

    auth(app);
    sort(app);
    upload(app);
    user(app);
    test(app);

    return app;
}