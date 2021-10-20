import React, { useState, useRef, useEffect, createContext } from 'react'
import io from 'socket.io-client'
import Peer from 'simple-peer'
import baseUrl from './baseUrl'

const SocketContext = createContext()
const socket = io(baseUrl)

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    const answerCall = () => {
        const acceptor = new Peer({ initiator: false, trickle: false, stream })
        acceptor.on('signal', (data) => {
            socket.emit("answercall", { signal: JSON.stringify(data), to: call.from })
        })

        acceptor.on('stream', (currentStream) => {
            console.log(currentStream)
            userVideo.current.srcObject = currentStream
        })

        acceptor.on("close", (da) => {
            console.log(da,'closed')
        })
        acceptor.on("error", (err) => {
            console.log(err)
        })
        console.log(call.signal)
        acceptor.signal(call.signal)
        console.log(acceptor)
        connectionRef.current = acceptor
        setCallAccepted(true)
    }

    const callUser = (id) => {
        const initiator = new Peer({ initiator: true, trickle: false, stream })
        initiator.on('signal', (data) => {
            socket.emit("calluser", { userToCall: id, signalData: JSON.stringify(data), from: me, name })
        })

        initiator.on('stream', (currentStream) => {
            console.log('inside stream')
            userVideo.current.srcObject = currentStream
        })
        initiator.on("close", (da) => {
            console.log(da,'closed')
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

    const leaveCall = () => {
        setCallEnded(true)
        console.log(connectionRef.current)
        // connectionRef.current.destroy()
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
            name,
            setName,
            callEnded,
            me,
            setStream,
            setMe,
            setCall,
            connectionRef,
            setCallAccepted,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }