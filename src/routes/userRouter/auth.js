const express = require('express');
const userController = require('../../controllers/userController.js');

const route = express.Router();

export default async (app) => {
    app.use('/auth', route);

    route.post('/login', userController.login);
    route.post('/signUp', userController.signUp);
    route.post('/isExistId', userController.isExistId);
    route.post('/isExistNick', userController.isExistNick);
    route.post('/sendMail', userController.sendMail);
    route.post('/authMail', userController.authMail);
}