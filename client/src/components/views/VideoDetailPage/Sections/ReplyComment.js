import React, { useEffect, useState } from 'react';

import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentList.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setChildCommentNumber(commentNumber);
  }, [props.commentList]);

  const renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment
              refreshFunc={props.refreshFunc}
              comment={comment}
              postId={props.postId}
            />
            <ReplyComment
              postId={props.postId}
              parentCommentId={comment._id}
              refreshFunc={props.refreshFunc}
              commentList={props.commentList}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const onClickHandler = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{
            fontSize: '14px',
            margin: '0',
            color: 'gray',
            cursor: 'pointer',
          }}
          onClick={onClickHandler}
        >
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
