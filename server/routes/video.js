const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');

const { auth } = require('../middleware/auth');
const multer = require('multer');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4' || ext !== '.avi' || ext !== '.mkv') {
      return cb(res.status(400).end('only mkv, avi, mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage }).single('file');

//=================================
//             video
//=================================

router.post('/uploadfiles', (req, res) => {
  // 클라에서 보낸 파일을 서버에 저장
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
