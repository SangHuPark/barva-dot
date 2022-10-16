import multer from "multer";
import multerS3 from 'multer-s3';
import * as path from 'path';
import AWS from 'aws-sdk';

const __dirname = path.resolve();
const s3config = path.join(__dirname, "./src/config/awss3config.json");

AWS.config.loadFromPath(s3config);

const s3 = new AWS.S3();

// multer 에 대한 설정값
export const awsUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'barva-dot', // 객체를 업로드할 버킷 이름
    acl: 'public-read', // Access control for the file
    key: (req, file, cb) => { // 객체의 키로 고유한 식별자 이기 때문에 겹치면 안됨
      cb(null, req.decoded.user_id + '.' + Date.now() + '.' + file.originalname.split('.').pop());
      // Math.floor(Math.random() * 1000).toString() + Date.now() + '.' + file.originalname.split('.').pop()
    },
  }),
});