import React, { useState } from 'react';
import { Typography, Button, Form, message, Icon, Input } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const privateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const categoriyOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Auto & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

function VideoUploadPage(props) {
  const [VedioTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Categoriy, setCategoriy] = useState('Film & Animation');

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDesChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategoriy(e.currentTarget.value);
  };

  const onDropHandler = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);
      } else {
        alert('비디오 업로드 실패');
      }
    });
  };

  const onSubmitHandler = (e) => {
    return false;
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmitHandler}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDropHandler} multiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type='plus' style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          <div>
            <img src='#' alt='#' />
          </div>
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VedioTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDesChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {privateOptions.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {categoriyOptions.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <Button type='primary' size='large' onClick={onSubmitHandler}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
