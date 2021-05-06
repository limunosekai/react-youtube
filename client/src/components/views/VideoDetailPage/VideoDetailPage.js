import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

import './VideoDetailPage.css';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = {
    videoId,
  };

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    Axios.post('/api/video/getvideo', variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.video);
      } else {
        alert('비디오 로딩 실패');
      }
    });

    Axios.post('/api/comment/getcomments', variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        alert('댓글 정보 로딩 실패');
      }
    });
  }, []);

  const refreshFunc = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  if (VideoDetail.writer) {
    const subscribeBtn = VideoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            <List.Item actions={[subscribeBtn]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={VideoDetail.writer && VideoDetail.writer.image}
                  />
                }
                title={<a href='https://ant.design'>{VideoDetail.title}</a>}
                description={VideoDetail.description}
              />
            </List.Item>
            {/* comments */}
            <Comment
              refreshFunc={refreshFunc}
              commentList={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
