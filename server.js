import express from "express";
import dotenv from "dotenv";

import router from "./src/routes/index.js";

dotenv.config();

async function startServer() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.set('port', process.env.PORT || 3003);

    app.use(router());
    
    app.listen(app.get('port'), (port) => {
        console.log(`Server start listening on ${app.get('port')} port...`);
    });
}

startServer();