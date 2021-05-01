import React from 'react';
import { Typography, Button, Form, message, Icon, Input } from 'antd';
import Dropzone from 'react-dropzone';
import { get } from 'mongoose';

const { TextArea } = Input;
const { Title } = Typography;

function VideoUploadPage(props) {
  const a = () => {
    return false;
  };
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={a}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop zone */}
          <Dropzone onDrop={a} multiple maxSize>
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
        <Input onChange={a} value />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={a} value />
        <br />
        <br />
        <select onChange={a}>
          <option key='1' value></option>
        </select>
        <br />
        <br />
        <select onChange={a}>
          <option key='1' value></option>
        </select>
        <br />
        <br />
        <Button type='primary' size='large' onClick={a}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
