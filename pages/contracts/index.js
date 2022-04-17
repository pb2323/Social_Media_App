import React, { useEffect, useContext, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import ContractFactory from "../../ethereum/factory";
// import Layout from "../components/Layout";
import { SocketContext } from '../../utils/Context'
import Link from "next/link";
import { useRouter } from 'next/router'
import _ from 'lodash';

function Index() {

  const router = useRouter()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const { wallet, userWallet } = useContext(SocketContext)

  useEffect(() => {
    // const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", userWallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
    const getContracts = async () => {
      if (!wallet || !userWallet) {
        router.push("/");
        return;
      }
      setLoading(true)
      // console.log('calling');
      const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
      // console.log(contract);
      const userContract = await ContractFactory.methods.getDeployedContract(userWallet).call();
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
          <Link href={`contracts/${address}`}>
            <a>View Contract</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  return (
    <>
      {!loading ? <><h3>Open Contracts</h3>
        <Link href="/contracts/new">
          <Button
            floated="right"
            content="Create Contract"
            icon="add circle"
            primary
          />
        </Link>
        {renderContracts()}
      </> : <h1>Loading...</h1>}
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
  //     // const { wallet, userWallet } = useContext(SocketContext)
  //     // console.log(wallet, userWallet);
  //   const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", userWallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
  //     const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
  //     const userContract = await ContractFactory.methods.getDeployedContract(userWallet).call();
  //     console.log(contract, userContract);
  //     return { contract };
  // }