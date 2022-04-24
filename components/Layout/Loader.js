import React, { useContext } from 'react'
import { Loader } from 'semantic-ui-react'
import { SocketContext } from '../../utils/Context'

const LoaderExampleInlineCentered = () => {
    
    const { loading } = useContext(SocketContext)

   return <Loader active={loading} inline='centered' style={{ position: 'fixed', top: '50%', left: '50%', zIndex:'1501' }} />
}

export default LoaderExampleInlineCentered