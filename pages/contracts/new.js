import React, { useState, useContext, useEffect } from "react";
// import Layout from "../../components/Contracts/Header";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
// import { Router } from "../../routes";
import { useRouter } from "next/router";
import { SocketContext } from '../../utils/Context'
import Link from 'next/link';

export default function NewPage() {
    // state = {
    //     minimumContribution: "",
    //     errorMessage: "",
    //     loading: false,
    // };
    const Router = useRouter();
    const [minimumContribution, setMinimumContribution] = useState("")
    const [guarantorAddress, setGuarantorAddress] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const { wallet, userWallet } = useContext(SocketContext)

    useEffect(() => {
        // const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", userWallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
        const getContracts = async () => {
            if (!wallet || !userWallet) {
                Router.push("/");
                return;
            }
            //   setLoading(true)
            //   console.log('calling');
            //   const contract = await ContractFactory.methods.getDeployedContract(wallet).call();
            //   console.log(contract);
            //   const userContract = await ContractFactory.methods.getDeployedContract(userWallet).call();
            //   console.log(contract, userContract);
            //   setLoading(false)
            //   setContracts(contract)
        }
        getContracts();
    }, [])

    const onSubmit = async (e) => {
        // this.setState({ loading: true, errorMessage: "" });
        setLoading(true)
        setErrorMessage("")
        try {
            e.preventDefault();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            await factory.methods
                .createContract(minimumContribution, wallet, !!guarantorAddress ? guarantorAddress : "0x10f771b16cA7F39d78573F55826c7D8d42C0C195")
                .send({ from: accounts[0] });
            Router.push("/contracts");
        } catch (err) {
            // this.setState({ errorMessage: err.message });
            setErrorMessage(err.message)
        }
        // this.setState({ loading: false });
        setLoading(false)
    };

    // render() {
    return (
        <>
            {/* <Layout /> */}
            <h3>Create a new Contract</h3>
            <Link href="/contracts"><Button style={{ marginTop: '10px', marginBottom: '10px' }} primary>Show Contracts</Button></Link>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        value={minimumContribution}
                        onChange={(e) => {
                            // this.setState({ minimumContribution: e.target.value });
                            setMinimumContribution(e.target.value)
                        }}
                        label="wei"
                        labelPosition="right"
                        type="number"
                    />
                    <br />
                    <label>Guarantor Address</label>
                    <Input
                        value={guarantorAddress}
                        onChange={(e) => {
                            // this.setState({ minimumContribution: e.target.value });
                            setGuarantorAddress(e.target.value)
                        }}
                        placeholder="For eg 0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMessage} />
                <Button loading={loading} primary>
                    Create
                </Button>
            </Form>

            {/* </Layout> */}
        </>
    );
    // }
}