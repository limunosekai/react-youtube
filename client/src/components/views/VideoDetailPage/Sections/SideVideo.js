import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get('/api/video/getvideos').then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert('비디오 로딩 실패');
      }
    });
  }, []);

  const renderSideVideo = SideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{
          display: 'flex',
          marginBottom: '1rem',
          padding: '1.5rem',
          border: '1px solid #eee',
        }}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <a href='#'>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='Thumbnail'
            />
          </a>
        </div>
        <div style={{ width: '50%' }}>
          <a href='#' style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div style={{ marginTop: '3rem' }} />
      {renderSideVideo}
    </React.Fragment>
  );
}

export default SideVideo;
