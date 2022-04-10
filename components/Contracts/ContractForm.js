import React, { Component } from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";
const Router = useRouter();

export default class ContractForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const contract = Contract(this.props.address);
    this.setState({ loading: true });
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      await contract.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/contracts/${this.props.address}`);
      this.setState({ errorMessage: "" });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            onChange={(e) => {
              this.setState({ value: e.target.value });
            }}
            value={this.state.value}
            labelPosition="right"
          />
        </Form.Field>
        <Button loading={this.state.loading} type="submit" primary>
          Contribute!
        </Button>
        <Message error header="Oops" content={this.state.errorMessage} />
      </Form>
    );
  }
}
