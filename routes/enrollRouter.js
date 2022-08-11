const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/')
    .post(userController.enroll);

module.exports = router;