import Link from "next/link";
import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
// import Layout from "../../../../components/Layout";
import Contract from "../../../../ethereum/contract";
import web3 from "../../../../ethereum/web3";
// import { Router } from "../../../../routes";
import { useRouter } from "next/router";
const Router = useRouter();

export default class newRequest extends Component {
    state = {
        value: "",
        description: "",
        recipient: "",
        loading: false,
        errorMessage: "",
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const contract = Contract(this.props.address);
        this.setState({ loading: true });
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const { description, value, recipient } = this.state;
            await contract.methods
                .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
                .send({
                    from: accounts[0],
                });
            Router.pushRoute(`/contracts/${this.props.address}/requests`);
            this.setState({ errorMessage: "" });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };

    render() {
        return (
            <>
                {/* <Layout> */}
                <Link href={`/contracts/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={(e) => {
                                this.setState({ description: e.target.value });
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.value}
                            onChange={(e) => {
                                this.setState({ value: e.target.value });
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={(e) => {
                                this.setState({ recipient: e.target.value });
                            }}
                        />
                    </Form.Field>
                    <Button type="submit" loading={this.state.loading} primary>
                        Create!
                    </Button>
                    <Message error header="Oops" content={this.state.errorMessage} />
                </Form>
                {/* </Layout> */}
            </>
        );
    }
}
