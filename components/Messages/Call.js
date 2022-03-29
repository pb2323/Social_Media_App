import React, { useEffect, useState, useContext } from 'react'
import { Modal, Button, } from "semantic-ui-react";
import { SocketContext } from '../../utils/Context'
import io from 'socket.io-client'
import baseUrl from '../../utils/baseUrl'
import styles from './Call.module.css'


const socket = io(baseUrl)


const Call = ({ open, setOpen, userProfilePicUrl, myProfilePicUrl, videoCall, setVideoCall }) => {

    const { callAccepted, callEnded, leaveCall, myVideo, userVideo, setStream, userCalled, callUser, stream, connectionRef } = useContext(SocketContext)
    const [mute, setMute] = useState(false);
    const [videoOff, setVideoOff] = useState(!videoCall);
    useEffect(() => {
        if (!videoOff)
            myVideo.current.srcObject = stream
    }, [videoOff])

    const muteMic = () => {
        stream.getAudioTracks().forEach((track) => track.enabled = !track.enabled)
        setMute(!mute)
    }

    const switchVideo = async () => {
        // if (videoOff && !stream.getVideoTracks()?.length) {
        //     const gumStream = await navigator.mediaDevices.getUserMedia(
        //         {video: true, audio: true});
        //     for (const track of gumStream.getTracks()) {
        //     connectionRef.addTrack(track);
        //     }
        // }
        // else
        stream.getVideoTracks().forEach((track) => track.enabled = !track.enabled)
        setVideoOff(!videoOff)
    }
    return (
        <>
            <Modal
                size='fullscreen'
                basic
                open={(open && !callEnded) || callAccepted}
            // onClose={() => setOpen(false)}
            >
                <div className={styles.main}>
                    <div className={styles.main__left}>
                        <div className={styles.main__videos}>
                            <div id="video-grid">

                            </div>
                        </div>
                        <div className={styles.main__controls}>
                            <div className={[styles.main__controls__block]}>
                                <div onClick={muteMic} className={[styles.main__controls__button, styles.main__mute_button].join(' ')}>
                                    {mute ? <i className='microphone disabled icon'></i> : <i className="microphone icon"></i>}
                                    {/* <i class="microphone slash icon"></i> */}
                                    <span>Mute</span>
                                </div>
                                <div onClick={switchVideo} className={[styles.main__controls__button, styles.main__video_button].join(' ')} >
                                    {/* <i className={styles.fas fa-video}></i> */}
                                    {videoOff ? <i className='video disabled icon'></i> : <i className="video icon"></i>}
                                    <span>Stop Video</span>
                                </div>
                            </div>
                            <div className={styles.main__controls__block}>
                                <div className={styles.main__controls__button}>
                                    {/* <i className={styles.fas fa-shield-alt}></i> */}
                                    <span>Security</span>
                                </div>
                                <div className={styles.main__controls__button}>
                                    {/* <i className={styles.fas fa-user-friends}></i> */}
                                    <span>Participants</span>
                                </div >
                                <div className={styles.main__controls__button}>
                                    {/* <i className={styles.fas fa-comment-alt}></i> */}
                                    <span>Chat</span>
                                </div >
                            </div >
                            <div className={styles.main__controls__block}>
                                <div onClick={() => {
                                    stream.getVideoTracks().forEach((track) => track.stop())
                                    stream.getAudioTracks().forEach((track) => track.stop())
                                    leaveCall(userCalled);
                                    setOpen(false)
                                    setVideoCall(false)
                                    // setCallEnded(true)
                                }} className={styles.main__controls__button}>
                                    <span className={styles.leave_meeting}>Leave Meeting</span>
                                </div>
                            </div>
                        </div >
                    </div >
                    <div className={styles.main__right}>
                        <div className={styles.main__right__video}>
                            {videoOff ? <img src={myProfilePicUrl} className={styles.display_image} /> : <video playsInline muted ref={myVideo} autoPlay className={styles.video} poster={myProfilePicUrl} />}

                        </div>
                        <div className={styles.main__right__video}>
                            <video playsInline ref={userVideo} autoPlay className={styles.video} poster={userProfilePicUrl} />              </div>

                    </div >
                </div >
            </Modal >
        </>
    )
}

export default React.memo(Call)
