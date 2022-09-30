const express = require('express');
const auth = require('./userRouter/auth.js');

exports.router = async () => {
    const app = express.Router();

    auth(app);

    return app;
}