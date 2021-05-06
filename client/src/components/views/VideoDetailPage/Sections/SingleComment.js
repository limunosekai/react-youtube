import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';

import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState('');

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const changeHandler = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const variable = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post('/api/comment/savecomment', variable).then((response) => {
      if (response.data.success) {
        setCommentValue('');
        setOpenReply(!OpenReply);
        props.refreshFunc(response.data.result);
      } else {
        alert('댓글 저장 실패');
      }
    });
  };

  const actions = [
    <React.Fragment>
      <LikeDislikes
        commentId={props.comment._id}
        userId={localStorage.getItem('userId')}
      />
      <span onClick={onClickReplyOpen} key='comment-basic-reply-to'>
        Reply to
      </span>
    </React.Fragment>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt='#' />}
        content={props.comment.content}
      />
      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={submitHandler}>
          <textarea
            style={{
              width: '80%',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}
            onChange={changeHandler}
            value={CommentValue}
            placeholder='댓글을 작성해주세요'
          />
          <br />
          <button
            style={{
              width: '15%',
              height: '52px',
              boxSizing: 'border-box',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '5px',
              background: '#CC0000',
              color: '#fff',
              fontSize: '1rem',
              marginLeft: '15px',
            }}
            onClick={submitHandler}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
