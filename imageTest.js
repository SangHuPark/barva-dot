const express = require('express');
const multer = require('multer');
const multerGoogleStorage = require('multer-google-storage');

const router = express.Router();

const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: 'barva-dot',
        projectId: 'vocal-clone-361507',
        keyFilename: 'vocal-clone-361507-0ca04cc3f265.json',
    }),
    /**
    * limits: { fileSize: 1080 * 1080 },
    */
});

router.route('/')
    .post(upload.single('img'), (req, res) => {
        console.log(req.file);
    });

module.exports = router;