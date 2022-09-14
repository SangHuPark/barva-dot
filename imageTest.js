const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const app = express();

const util = require('./API/function/replyFunc.js');

app.use('/', express.static(path.join(__dirname, "./uploads/1663155762972.jpg")));

var reply = {};

try {
  fs.readdirSync("upload");
} catch (err) {
  console.error("Not Exist 'upload' Folder. Creating Folder...");
  fs.mkdirSync("upload");
}

var fileStorage = multer.diskStorage({
  // 저장 폴더 위치
  destination: (req, file, callback) => {
    callback(null, "upload/");
  },
  //파일이름
  filename: (req, file, callback) => {
    callback(null, new Date().valueOf() + path.extname(file.originalname));
  },
});

var multerUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 20 * 1080 * 1080, // 20MB 로 제한
  },
});

router.route('/')
    .get((req, res) => {
      res.sendFile(path.join(__dirname, "./uploads/1663155762972.jpg"));
      console.log(path.join(__dirname, "./uploads/1663155762972.jpg"));
    })
    .post(multerUpload.single('img'), (req, res) => {
        console.log(req.file);
        console.log(req.file.path);
        res.json(util.makeReply(reply, true, 200, "Image Upload Success"));
    });

module.exports = router;