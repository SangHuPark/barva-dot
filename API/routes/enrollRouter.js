const express = require('express');
const userController = require('../controllers/userController.js');
const form = require('../validation/form.js');

const router = express.Router();

router.route('/')
    .post(form.enrollCheck, userController.enroll);

module.exports = router;