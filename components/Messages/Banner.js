import React, { useState, useContext } from "react";
import { Segment, Grid, Image } from "semantic-ui-react";
import styled from "styled-components";
import AudioCallIcon from '../../statics/icons/AudioCallIcon'
import VideoCallIcon from '../../statics/icons/VideoCallIcon'
import CallModal from './Call'
// import { SocketContext } from '../../utils/Context'
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

function Banner({ bannerData, connectedUsers, userProfilePicUrl, callUser, callAccepted, setStream, call, userVideo, myVideo, leaveCall, callEnded }) {
  // const { callUser, callAccepted } = useContext(SocketContext)
  const { name, profilePicUrl, userId } = bannerData;
  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === userId).length >
    0;
  const [open, setOpen] = useState(false)
  const userSocketId = connectedUsers.reduce((acc, ele) => {
    if (ele.userId.toString() === userId.toString()) acc = ele.socketId
    return acc
  }, null)
  return (
    <>
      {(open || callAccepted) && <CallModal callAccepted={callAccepted} callEnded={callEnded} leaveCall={leaveCall} myVideo={myVideo} userVideo={userVideo} call={call} setStream={setStream} userProfilePicUrl={profilePicUrl} myProfilePicUrl={userProfilePicUrl} open={open} setOpen={setOpen} />}
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
              <CallButton disabled={!isOnline} onClick={() => {
                if (isOnline) {
                  setOpen(true);
                  callUser(userSocketId)
                }
              }}>
                <AudioCallIcon />
              </CallButton>
              <CallButton disabled={!isOnline} onClick={() => {
                if (isOnline) {
                  setOpen(true)
                  callUser(userSocketId)
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
