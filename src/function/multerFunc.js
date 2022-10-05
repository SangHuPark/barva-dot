import multer from "multer";
import path from "path";
import fs from "fs";

// app.use('/', express.static(path.join(__dirname, "./uploads/1663155762972.jpg")));

try {
  fs.readdirSync("upload");
} catch (err) {
  console.error("Not Exist 'upload' Folder. Creating Folder...");
  fs.mkdirSync("upload");
}

var fileStorage = multer.diskStorage({
  // 저장 폴더 위치
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  //파일이름
  filename: (req, file, cb) => {
    cb(null, new Date().valueOf() + path.extname(file.originalname));
  },
});

export const multerUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 20 * 1080 * 1080, // 20MB 로 제한
  },
});

// export default multerUpload;

// router.route('/')
//     .get((req, res) => {
//       res.sendFile(path.join(__dirname, "./uploads/1663155762972.jpg"));
//       console.log(path.join(__dirname, "./uploads/1663155762972.jpg"));
//     })
//     .post(multerUpload.single('img'), (req, res) => {
//         console.log(req.file);
//         console.log(req.file.path);
//         res.json(util.makeReply(reply, true, 200, "Image Upload Success"));
//     });

// module.exports = router;