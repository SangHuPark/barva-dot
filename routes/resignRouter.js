const express = require('express');

const { auth } = require('../auth/jwt.js');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/')
    .delete(auth, userController.resign);

module.exports = router;