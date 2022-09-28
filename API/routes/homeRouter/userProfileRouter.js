const express = require('express');

const postController = require('../../controllers/homeController.js');
const jwt = require('../../validation/jwt.js'); 

const router = express.Router();

router.route('/')
    .get(jwt.auth, postController.userProfile);

module.exports = router;