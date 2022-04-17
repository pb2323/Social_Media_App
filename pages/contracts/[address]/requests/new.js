import Link from "next/link";
import React, { Component, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
// import Layout from "../../../../components/Layout";
import Contract from "../../../../ethereum/contract";
import web3 from "../../../../ethereum/web3";
// import { Router } from "../../../../routes";
import { useRouter } from "next/router";

export default function NewRequest() {
    // state = {
    //     value: "",
    //     description: "",
    //     recipient: "",
    //     loading: false,
    //     errorMessage: "",
    // };

    const Router = useRouter();
    const [value, setValue] = useState("")
    const [description, setDescription] = useState("")
    const [recipient, setRecipient] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { address } = Router.query

    // static async getInitialProps(props) {
    //     const { address } = props.query;
    //     return { address };
    // }

    const onSubmit = async (event) => {
        event.preventDefault();
        const contract = Contract(address);
        // this.setState({ loading: true });
        setLoading(true)
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            // const { description, value, recipient } = this.state;
            await contract.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({
                    from: accounts[0],
                });
            Router.push(`/contracts/${address}/requests`);
            // this.setState({ errorMessage: "" });
            setErrorMessage("")
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
                {/* <Layout> */}
                <Link href={`/contracts/${address}/requests`}>
                    Back
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={onSubmit} error={!!errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={description}
                            onChange={(e) => {
                                // this.setState({ description: e.target.value });
                                setDescription(e.target.value)
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={value}
                            onChange={(e) => {
                                // this.setState({ value: e.target.value });
                                setValue(e.target.value)
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={recipient}
                            onChange={(e) => {
                                // this.setState({ recipient: e.target.value });
                                setRecipient(e.target.value)
                            }}
                        />
                    </Form.Field>
                    <Button type="submit" loading={loading} primary>
                        Create!
                    </Button>
                    <Message error header="Oops" content={errorMessage} />
                </Form>
                {/* </Layout> */}
            </>
        );
    // }
}
