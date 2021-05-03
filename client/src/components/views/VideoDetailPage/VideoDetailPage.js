import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

import './VideoDetailPage.css';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = {
    videoId,
  };

  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post('/api/video/getvideo', variable).then((response) => {
      if (response.data.success) {
        setVideoDetail(response.data.video);
      } else {
        alert('비디오 로딩 실패');
      }
    });
  }, []);

  if (VideoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            <List.Item
              actions={[
                <Subscribe
                  userTo={VideoDetail.writer._id}
                  userFrom={localStorage.getItem('userId')}
                />,
              ]}
            >
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
