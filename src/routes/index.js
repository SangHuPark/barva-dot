import { Router } from "express";

import auth from "./auth.js";
import home from "./home.js";

export default () => {
    const app = Router();

    auth(app);
    home(app);

    return app;
}