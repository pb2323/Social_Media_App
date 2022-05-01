import React, { useEffect, useContext, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import ContractFactory from "../../ethereum/factory";
// import Layout from "../components/Layout";
import { SocketContext } from '../../utils/Context'
import Link from "next/link";
import { useRouter } from 'next/router'
import _ from 'lodash';

function Guarantor({ Wallet }) {

    const router = useRouter()
    const [contracts, setContracts] = useState([])
    // const [loading, setLoading] = useState(false)
    const { wallet, loading, setLoading } = useContext(SocketContext)

    useEffect(() => {
        // const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", Wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
        const getContracts = async () => {
            //   if (!wallet || !Wallet) {
            //     router.push("/");
            //     return;
            //   }
            setLoading(true)
            // console.log('calling');
            //   const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
            // console.log(contract);
            const userContracts = await ContractFactory.methods.getGuarantorContracts(Wallet).call();
            //   const intersection = _.intersection(contract, userContract);
            setLoading(false)
            setContracts(userContracts)
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
                        View Contract
                    </Link>
                ),
                fluid: true,
            };
        });
        return <Card.Group items={items} />;
    }
    console.log('rendering');
    return (
        <>
            {!loading ? <><h3>Guarantor Contracts</h3>
                {/* <Link href="/contracts/new">
          <Button
            floated="right"
            content="Create Contract"
            icon="add circle"
            primary
          />
        </Link> */}
                <Link href="/contracts">
                    <Button
                        content="Back"
                        primary
                        style={{ marginBottom: '10px' }}
                    />
                </Link>
                {renderContracts()}
            </> : <></>}
        </>
    )
}

export default Guarantor;
