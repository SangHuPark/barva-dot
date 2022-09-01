const express = require('express');
const userController = require('../controllers/userController.js');
const { enrollValidation } = require('../validation/joi.js');

const router = express.Router();

router.route('/')
    .post(enrollValidation, userController.duplicateCheck);

module.exports = router;