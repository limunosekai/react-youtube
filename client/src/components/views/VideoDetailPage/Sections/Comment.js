import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  const user = useSelector((state) => state.user);
  const videoId = props.postId;

  const [commentValue, setcommentValue] = useState('');

  const changeHandler = (e) => {
    setcommentValue(e.currentTarget.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const variable = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };

    Axios.post('/api/comment/savecomment', variable).then((response) => {
      if (response.data.success) {
        setcommentValue('');
        props.refreshFunc(response.data.result);
      } else {
        alert('댓글 저장 실패');
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <br />
      {/* Comment Lists */}
      {props.commentList &&
        props.commentList.map((comment, index) => {
          return (
            !comment.responseTo && (
              <React.Fragment key={index}>
                <SingleComment
                  refreshFunc={props.refreshFunc}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  postId={videoId}
                  parentCommentId={comment._id}
                  refreshFunc={props.refreshFunc}
                  commentList={props.commentList}
                />
              </React.Fragment>
            )
          );
        })}
      {/* Root Component Form */}
      <form
        style={{ display: 'flex', marginTop: '30px' }}
        onSubmit={submitHandler}
      >
        <textarea
          style={{ width: '80%', borderRadius: '5px', boxSizing: 'border-box' }}
          onChange={changeHandler}
          value={commentValue}
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
    </div>
  );
}

export default Comment;
