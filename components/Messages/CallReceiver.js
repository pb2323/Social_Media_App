import React, { useContext } from 'react'
import styled from "styled-components";
import styles from './CallReceiver.module.css'
import CallAcceptIcon from '../../statics/icons/CallAcception'
import CallRejectIcon from '../../statics/icons/CallRejection'
// import { SocketContext } from '../../utils/Context'

const ButtonPanel = styled.div`
  background: linear-gradient(95.16deg, #ff00c7 -24.95%, #3d98e7 124.85%);
  border-radius: 12px;
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  image-rendering: optimizeQuality;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 44px;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const CallAcceptButton = styled.button`
  width: 70px;
  height: 42px;
  border: 1px solid #18ff21;
  box-sizing: border-box;
  border-radius: 19px 0px 0px 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;

  &:hover {
    background: rgba(24, 255, 33, 0.1);
  }
`;

const CallRejectButton = styled.button`
  width: 70px;
  height: 42px;
  border: 1px solid #ff1818;
  box-sizing: border-box;
  border-radius: 0px 19px 19px 0px ;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;

  &:hover {
    background: rgba(255, 24, 24, 0.1);
  }
`;


const CallReceiver = ({ chat,answerCall, leaveCall }) => {
    // const { answerCall, leaveCall } = useContext(SocketContext)
    return (
        <div className={styles.main}>
            <div className={styles.videos}>
                <p style={{ color: 'white', position: 'relative', top: '5px' }}>{chat.name} is calling</p>
                <img height='150px' width='70%' src={chat.profilePicUrl} style={{
                    objectFit: 'contain',
                    // borderRadius: '50%'
                }} />
            </div>
            <div className={styles.controls}>
                <CallAcceptButton onClick={answerCall}>
                    <CallAcceptIcon />
                </CallAcceptButton>
                <CallRejectButton onClick={leaveCall}>
                    <CallRejectIcon />
                </CallRejectButton>
            </div>
        </div>
    )
}

export default CallReceiver
