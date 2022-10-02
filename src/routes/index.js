import { Router } from "express";

import auth from "./auth.js";
import feed from "./feed.js";

export default () => {
    const app = Router();

    auth(app);
    feed(app);

    return app;
}