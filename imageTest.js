const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

try {
  fs.readdirSync("upload");
} catch (err) {
  console.error("Not Exist 'upload' Folder. Creating Folder...");
  fs.mkdirSync("upload");
}

const fileStorage = multer.diskStorage({
  // 저장 폴더 위치
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  //파일이름
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-barva-${file.originalname}`);
  },
});

const multerUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 20 * 1080 * 1080, // 20MB 로 제한
  },
});

module.exports = multerUpload;

const router = express.Router();

router.route('/')
    .post(upload.single('img'), (req, res) => {
        console.log(req.file);
    });

module.exports = router;