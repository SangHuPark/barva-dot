const express = require('express');

const userController = require('../../controllers/userController.js');
const form = require('../../validation/form.js');

const router = express.Router();

router.route('/')
    .post(form.idCheck, userController.duplicatedIdCheck);

module.exports = router;