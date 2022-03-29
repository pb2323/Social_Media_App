import React, { useState, useContext } from "react";
import { Segment, Grid, Image } from "semantic-ui-react";
import styled from "styled-components";
import AudioCallIcon from '../../statics/icons/AudioCallIcon'
import VideoCallIcon from '../../statics/icons/VideoCallIcon'
import CallModal from './Call'
import { SocketContext } from '../../utils/Context'
import { findConnectedUser } from '../../utilsServer/roomActions'

const ActionsDiv = styled.div`
  display: flex;
`;

const CallButton = styled.div`
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  margin-left: 21px;
  svg path {
    fill: ${({ disabled }) => (disabled ? "#525252" : "#000")};
  }
`;

function Banner({ bannerData, connectedUsers, userProfilePicUrl, open, setOpen }) {
  const { callUser, callAccepted, setUserCalled, setStream, call } = useContext(SocketContext)
  const { name, profilePicUrl, userId } = bannerData;
  const [videoCall, setVideoCall] = useState(call.isVideoCall);
  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === userId).length >
    0;
  const userSocketId = connectedUsers.reduce((acc, ele) => {
    if (ele.userId.toString() === userId.toString()) acc = ele.socketId
    return acc
  }, null)
  return (
    <>
      {(open || callAccepted) && <CallModal videoCall={videoCall || call.isVideoCall} userProfilePicUrl={profilePicUrl} myProfilePicUrl={userProfilePicUrl} open={open} setOpen={setOpen} setVideoCall={setVideoCall} />}
      <Segment color="teal" attached="top">
        <Grid>
          <Grid.Column floated="left" width={12}>
            <h4>
              <Image avatar src={profilePicUrl} />
              {name}
            </h4>
          </Grid.Column>
          <Grid.Column floated="right" width={2}>
            <ActionsDiv>
              <CallButton disabled={!isOnline} onClick={async () => {
                if (isOnline) {
                  const currentStream = await navigator.mediaDevices.getUserMedia({ audio: true })
                  setStream(currentStream)
                  setUserCalled(userSocketId)
                  callUser(userSocketId, currentStream, false)
                  setOpen(true);
                }
              }}>
                <AudioCallIcon />
              </CallButton>
              <CallButton disabled={!isOnline} onClick={async () => {
                if (isOnline) {
                  const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                  setStream(currentStream)
                  setUserCalled(userSocketId)
                  callUser(userSocketId, currentStream, true)
                  setVideoCall(true)
                  setOpen(true);
                }
              }}>
                <VideoCallIcon />
              </CallButton>
            </ActionsDiv>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

export default Banner;
