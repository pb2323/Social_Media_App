import React, { useState, useContext, useEffect } from "react";
// import Layout from "../../components/Contracts/Header";
import { Form, Button, Input, Message, Dropdown } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import { rinkebyInstance, polygonInstance } from "../../ethereum/networkFactory";
import { MetamaskNotFound, NetworkNotSupported } from "../../components/Layout/NoData";
import { ErrorToastr } from "../../components/Layout/Toastr";
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
    const [toastrMessage, setToastrMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [showToastr, setShowToastr] = useState(false)
    const options = [
        {
            key: "Rinkeby Test Network",
            value: "Rinkeby Test Network",
            text: "Rinkeby Test Network"
        },
        {
            key: "Mumbai Test Network",
            value: "Mumbai Test Network",
            text: "Mumbai Test Network"
        }
    ]
    const [selectedEnv, setSelectedEnv] = useState(
        "Mumbai Test Network"
    )
    const { wallet, userWallet, metamaskConnected, networkSupported, setMetamaskConnected, setNetworkSupported } = useContext(SocketContext)

    useEffect(() => {
        // const wallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF", userWallet="0x7CC00206d1cFd032f834B3320F47FF64e7A470bF"
        const getContracts = async () => {
            if (!wallet || !userWallet) {
                Router.push("/");
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
            if (window.ethereum && networkVersion == '4')
                setSelectedEnv("Rinkeby Test Network")
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

    useEffect(() => {
        showToastr && setTimeout(() => setShowToastr(false), 4000);
    }, [showToastr]);

    const onSubmit = async (e) => {
        // this.setState({ loading: true, errorMessage: "" });
        let factory;
        if ((window.ethereum.networkVersion == '80001' && selectedEnv === 'Rinkeby Test Network') || (window.ethereum.networkVersion == '4' && selectedEnv === 'Mumbai Test Network')) {
            setToastrMessage("Metamask network environment and selected enviroment donot match")
            setShowToastr(true)
            return
        }
        if (!minimumContribution) {
            setToastrMessage("Minimum Contribution is mandatory field")
            return
        }
        factory = selectedEnv == 'Mumbai Test Network' ? polygonInstance : rinkebyInstance
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
    if (!metamaskConnected) return (<MetamaskNotFound />)
    return (
        <>
            {/* <Layout /> */}
            {showToastr && <ErrorToastr error={toastrMessage} />}
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
                        required
                    />
                    <br />
                    <br />
                    <label>Blockchain Environment</label>
                    <Dropdown
                        placeholder='Select Enviroment'
                        fluid
                        selection
                        options={options}
                        defaultValue={selectedEnv}
                        value={selectedEnv}
                        onChange={(e, data) => {
                            setSelectedEnv(data.value)
                        }}
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