import React, { useEffect, useState, useContext } from 'react'
import { Modal, Button, } from "semantic-ui-react";
// import { SocketContext } from '../../utils/Context'
import io from 'socket.io-client'
import baseUrl from '../../utils/baseUrl'
import styles from './Call.module.css'


const socket = io(baseUrl)


const Call = ({ open, setOpen, userProfilePicUrl, myProfilePicUrl, callAccepted, callEnded, leaveCall, myVideo, userVideo, call, setStream }) => {

    // const { callAccepted, callEnded, leaveCall, myVideo, userVideo, call, setStream } = useContext(SocketContext)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream)
                myVideo.current.srcObject = currentStream
            })


    }, [])
    console.log(call)
    return (
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
                            <div onclick="muteUnmute()" className={[styles.main__controls__button, styles.main__mute_button].join(' ')}>
                                <i className="microphone icon"></i>
                                {/* <i class="microphone slash icon"></i> */}
                                <span>Mute</span>
                            </div>
                            <div onclick="playStop()" className={[styles.main__controls__button, styles.main__video_button].join(' ')} >
                                {/* <i className={styles.fas fa-video}></i> */}
                                <i className="video icon"></i>
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
                                leaveCall();
                                setOpen(false)
                            }} className={styles.main__controls__button}>
                                <span className={styles.leave_meeting}>Leave Meeting</span>
                            </div>
                        </div>
                    </div >
                </div >
                <div className={styles.main__right}>
                    <div className={styles.main__right__video}>
                        <video playsInline muted ref={myVideo} autoPlay className={styles.video} poster={myProfilePicUrl} />
                    </div>
                    <div className={styles.main__right__video}>
                        <video playsInline muted ref={userVideo} autoPlay className={styles.video} poster={userProfilePicUrl} />              </div>

                </div >
            </div >
        </Modal >
    )
}

export default React.memo(Call)
