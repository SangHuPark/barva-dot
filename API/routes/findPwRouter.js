const express = require('express');
const userController = require('../controllers/userController.js');
const form = require('../validation/form.js');

const router = express.Router();

router.route('/')
    .post(userController.findPw);

module.exports = router;