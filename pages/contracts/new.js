import React, { useState, useContext, useEffect } from "react";
// import Layout from "../../components/Contracts/Header";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
// import { Router } from "../../routes";
import { useRouter } from "next/router";
import { SocketContext } from '../../utils/Context'

export default function NewPage() {
    // state = {
    //     minimumContribution: "",
    //     errorMessage: "",
    //     loading: false,
    // };
    const Router = useRouter();
    const [minimumContribution, setMinimumContribution] = useState("")
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
                .createContract(minimumContribution, wallet)
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