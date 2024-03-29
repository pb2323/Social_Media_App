import React, { useEffect, useContext, useState } from "react";
import { Card, Button } from "semantic-ui-react";
// import ContractFactory from "../../ethereum/factory";
// import Layout from "../components/Layout";
import { MetamaskNotFound, NetworkNotSupported } from "../../components/Layout/NoData";
import { SocketContext } from '../../utils/Context'
import { rinkebyInstance, polygonInstance } from "../../ethereum/networkFactory";
import Link from "next/link";
import { useRouter } from 'next/router'
import _ from 'lodash';

function Index({ Wallet }) {
  const router = useRouter()
  const [contracts, setContracts] = useState([])
  // const [loading, setLoading] = useState(false)
  const { wallet, loading, setLoading, networkSupported, setNetworkSupported, metamaskConnected, setMetamaskConnected } = useContext(SocketContext)

  useEffect(() => {
    // const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", Wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
    const getContracts = async () => {
      if (!wallet || !Wallet) {
        router.push("/");
        return;
      }
      const isMetamaskConnected = await ethereum?._metamask?.isUnlocked();
      if (isMetamaskConnected) {
        setMetamaskConnected(true)
      }
      const networkVersion = await ethereum?.request({ method: 'net_version' })
      if (window.ethereum && !(['4', '80001'].includes(networkVersion))) {
        setNetworkSupported(false)
        return
      }

      setLoading(true)
      // console.log('calling');
      const ContractFactory = networkVersion == '4' ? rinkebyInstance : polygonInstance
      const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
      // console.log(contract);
      const userContract = await ContractFactory.methods.getDeployedContract(Wallet).call();
      const intersection = _.intersection(contract, userContract);
      setLoading(false)
      setContracts(intersection)
    }
    getContracts();
  }, [])
  // console.log(loading)
  const renderContracts = () => {
    const items = contracts.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/contracts/${address}`}>
            <a>View Contract</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  if (!metamaskConnected) return (<MetamaskNotFound />)
  return (
    <>
      {networkSupported ? (!loading ? <><h3>Contracts</h3>
        <Link href="/contracts/guarantor">
          <Button
            content="View Guarantor Contracts"
            primary
            style={{ marginBottom: "10px" }}
          />
        </Link>
        <Link href="/contracts/new">
          <Button
            floated="right"
            content="Create Contract"
            icon="add circle"
            primary
          />
        </Link>
        {renderContracts()}
      </> : <></>) : <NetworkNotSupported />}
    </>
  )
}

export default Index;
{/* <div>
<h3>Open Contracts</h3>
<Link href="/contracts/new">
  <Button
    floated="right"
    content="Create Contract"
    icon="add circle"
    primary
  />
</Link>
renderContracts()
</div> */}

  // Index.getInitialProps = async (ctx) => {
  //     // const { wallet, Wallet } = useContext(SocketContext)
  //     // console.log(wallet, Wallet);
  //   const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", Wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
  //     const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
  //     const userContract = await ContractFactory.methods.getDeployedContract(Wallet).call();
  //     console.log(contract, userContract);
  //     return { contract };
  // }