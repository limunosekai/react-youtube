const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');

const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

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

router.post('/uploadvideo', (req, res) => {
  // 비디오 정보를 DB에 저장
  const video = new Video(req.body);
  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/getsubscriptionvideos', (req, res) => {
  // 로그인한 유저의 id로 구독한 사람을 찾음
  Subscriber.find({ userFrom: req.body.userFrom }).exec(
    (err, subscriberInfo) => {
      if (err) return res.status(400).send(err);

      let subscribedUser = [];

      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });

      // 찾은 사람의 비디오 정보를 가져옴
      Video.find({ writer: { $in: subscribedUser } })
        .populate('writer')
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json({ success: true, videos });
        });
    }
  );
});

router.get('/getvideos', (req, res) => {
  // 전체 비디오를 DB에서 가져와서 클라에게 전송
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

router.post('/getvideo', (req, res) => {
  // 비디오를 DB에서 가져와서 클라에게 전송
  Video.findOne({ _id: req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, video });
    });
});

router.post('/thumbnail', (req, res) => {
  // 클라에서 보낸 데이터로 썸네일 생성, 비디오 러닝타임 가져오기

  let filePath = '';
  let fileDuration = '';

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
      console.log('Will generate' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // 20%, 40%, 60% 스샷 찍기
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      filename: 'thumbnail-%b.png',
    });
});

module.exports = router;
