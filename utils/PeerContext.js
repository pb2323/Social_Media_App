// import React, { useState, useRef, useEffect, createContext } from 'react'
// import io from 'socket.io-client'
// import Peer from 'simple-peer'
// import baseUrl from './baseUrl'

// const PeerContext = createContext()
// const socket = io(baseUrl)

// const PeerContextProvider = ({ children }) => {

//     const [stream, setStream] = useState(null)
//     const acceptor = new Peer({ initiator: false, trickle: false, stream })
//     const initiator = new Peer({ initiator: true, trickle: false, stream })

//     const callUser = (id) => {
//         initiator.on('signal', (data) => {
//             socket.emit("calluser", { userToCall: id, signalData: data, from: me, name })
//         })

//         initiator.on('stream', (currentStream) => {
//             console.log('inside stream')
//             userVideo.current.srcObject = currentStream
//         })
//         socket.on('callaccepted', (signal) => {
//             console.log('callaccept')
//             initiator.signal(signal)
//             setTimeout(() => {
//                 setCallAccepted(true)
//             }, 1000)
//         })
//         // setTimeout(() => {
//         //     console.log(socket)
//         // }, 5000)
//         connectionRef.current = initiator

//         // console.log(peer)
//         // setPeercon(peer)
//     }

//     const leaveCall = () => {
//         setCallEnded(true)
//         console.log(connectionRef.current)
//         connectionRef.current.destroy()
//     }
//     return (
//         <SocketContext.Provider value={{
//             answerCall,
//             callUser,
//             leaveCall,
//             call,
//             callAccepted,
//             myVideo,
//             userVideo,
//             stream,
//             name,
//             setName,
//             callEnded,
//             me,
//             setStream,
//             setMe,
//             setCall,
//             connectionRef,
//             setCallAccepted,
//         }}>
//             {children}
//         </SocketContext.Provider>
//     )
// }

// export { PeerContextProvider, SocketContext }