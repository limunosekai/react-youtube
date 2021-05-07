import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [Dislikes, setDislikes] = useState(0);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post('/api/like/getlikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 좋아요를 받았는지
        setLikes(response.data.likes.length);

        // 내가 이미 눌렀는지
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('좋아요 정보 로딩 실패');
      }
    });

    Axios.post('/api/like/getdislikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 싫어요를 받았는지
        setDislikes(response.data.dislikes.length);

        // 내가 이미 눌렀는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('싫어요 정보 로딩 실패');
      }
    });
  }, []);

  const onLike = () => {
    // 좋아요가 눌려있지 않은 경우
    if (LikeAction === null) {
      Axios.post('/api/like/uplike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction('liked');
          // 이미 싫어요가 눌려있는 경우
          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert('좋아요 실패');
        }
      });
    } else {
      // 좋아요가 눌려있는 경우
      Axios.post('/api/like/unlike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert('좋아요 취소 실패');
        }
      });
    }
  };

  const onDislike = () => {
    // 싫어요가 눌려있지 않은 경우
    if (DislikeAction === null) {
      Axios.post('/api/like/updislike', variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction('disliked');
          // 이미 좋아요가 눌려있는 경우
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert('싫어요 실패');
        }
      });
    } else {
      // 싫어요가 눌려있는 경우
      Axios.post('/api/like/undislike', variable).then((response) => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert('싫어요 취소 실패');
        }
      });
    }
  };

  return (
    <div>
      <span key='comment-basic-like'>
        <Tooltip title='Like'>
          <Icon
            type='like'
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
      </span>
      &nbsp;&nbsp;
      <span key='comment-basic-dislike'>
        <Tooltip title='Dislike'>
          <Icon
            type='dislike'
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
      </span>
      &nbsp;&nbsp;
    </div>
  );
}

export default LikeDislikes;
