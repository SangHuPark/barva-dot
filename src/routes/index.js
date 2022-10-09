import { Router } from "express";

import auth from "./auth.js";
import main from "./main.js";

export default () => {
    const app = Router();

    auth(app);
    main(app);

    return app;
}