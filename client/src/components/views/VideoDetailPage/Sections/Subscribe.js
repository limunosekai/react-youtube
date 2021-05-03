import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let variable = {
      userTo: props.userTo,
    };

    Axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert('구독자 정보 로딩 실패');
      }
    });

    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId'),
    };

    Axios.post('/api/subscribe/subscribed', subscribedVariable).then(
      (response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else {
          alert('구독 정보 로딩 실패');
        }
      }
    );
  }, []);

  const onSubscribeHandler = () => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (Subscribed) {
      // 이미 구독중
      Axios.post('/api/subscribe/unSubscribe', subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 취소 실패');
          }
        }
      );
    } else {
      // 구독 하기
      Axios.post('/api/subscribe/subscribe', subscribeVariable).then(
        (response) => {
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1);
            setSubscribed(!Subscribed);
          } else {
            alert('구독 실패');
          }
        }
      );
    }
  };

  return (
    <div>
      <button
        style={{
          border: 'none',
          outline: 'none',
          appearance: 'none',
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '4px',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
        onClick={onSubscribeHandler}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;
