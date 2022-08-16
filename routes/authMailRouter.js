const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/')
    .post(userController.sendMail);

module.exports = router;