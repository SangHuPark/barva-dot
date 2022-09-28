const express = require('express');

const userController = require('../../controllers/userController.js');
const form = require('../../validation/form.js');

const router = express.Router();

router.route('/')
    .post(form.emailForm, userController.sendMail);

module.exports = router;