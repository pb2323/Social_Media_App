import React, { useState, useRef, useEffect, createContext } from 'react'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import baseUrl from './baseUrl'

const SocketContext = createContext()
const socket = io(baseUrl)

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [userCalled, setUserCalled] = useState("")
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [wallet, setWallet] = useState("")
    const [userWallet, setUserWallet] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    const answerCall = (currentStream) => {
        const acceptor = new Peer({ initiator: false, trickle: false, stream: currentStream })
        setStream(currentStream)
        acceptor.on('signal', (data) => {
            socket.emit("answercall", { signal: JSON.stringify(data), to: call.from })
        })

        acceptor.on('stream', (currentStream) => {
            console.log(currentStream)
            userVideo.current.srcObject = currentStream
        })

        acceptor.on("close", (da) => {
            console.log(da, 'closed')
        })
        acceptor.on("error", (err) => {
            console.log(err)
        })
        acceptor.signal(call.signal)
        connectionRef.current = acceptor
        setCallAccepted(true)
    }

    const callUser = (id, currentStream, isVideoCall) => {
        const initiator = new Peer({ initiator: true, trickle: false, stream: currentStream })
        initiator.on('signal', (data) => {
            socket.emit("calluser", { userToCall: id, signalData: JSON.stringify(data), from: me, isVideoCall })
        })

        initiator.on('stream', (currentStream) => {
            console.log('inside stream')
            userVideo.current.srcObject = currentStream
        })
        initiator.on("close", (da) => {
            console.log(da, 'closed')
        })
        initiator.on("error", (err) => {
            console.log(err)
        })
        // setTimeout(() => {
        //     console.log(socket)
        // }, 5000)
        connectionRef.current = initiator

        // console.log(peer)
        // setPeercon(peer)
    }

    const leaveCall = (id) => {
        setCallEnded(true)
        socket.emit("leaveCall", { to: id, from: me });
        connectionRef?.current?.destroy()
    }

    const rejectCall = () => {
        socket.emit("leaveCall", { to: userCalled, from: me });
        setToDefault();
    }

    const setToDefault = () => {
        setCallAccepted(false)
        setCallEnded(false)
        stream?.getVideoTracks()?.forEach((track) => track.stop())
        stream?.getAudioTracks()?.forEach((track) => track.stop())
        setStream(null)
        setUserCalled("")
        setCall({})
        // myVideo = useRef()
        // userVideo = useRef()
        // connectionRef = useRef()
    }

    return (
        <SocketContext.Provider value={{
            answerCall,
            callUser,
            leaveCall,
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            callEnded,
            me,
            setStream,
            setMe,
            setCall,
            connectionRef,
            setCallAccepted,
            setCallEnded,
            userCalled,
            setUserCalled,
            setToDefault,
            rejectCall,
            wallet,
            userWallet,
            setWallet,
            setUserWallet
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }