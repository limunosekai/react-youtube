const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

//=================================
//             comment
//=================================

router.post('/savecomment', (req, res) => {
  // 댓글 저장
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post('/getcomments', (req, res) => {
  // 댓글 정보 불러오기
  Comment.find({ postId: req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
