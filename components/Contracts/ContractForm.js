import React, { useContext, useState } from "react";
import { Form, Message, Button, Input } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
// import { SocketContext } from '../../utils/Context'

import { useRouter } from "next/router";

export default function ContractForm({ address, manager, freelancer }) {
  // state = {
  //   value: "",
  //   loading: false,
  //   errorMessage: "",
  // };
  const [value, setValue] = useState("");
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageProject, setErrorMessageProject] = useState("");
  const Router = useRouter();
  // const { wallet, userWallet } = useContext(SocketContext)

  const onSubmit = async (event) => {
    event.preventDefault();
    const contract = Contract(address);
    // this.setState({ loading: true });
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log(accounts[0], manager, freelancer);
      if (accounts[0] === manager.toLowerCase() || accounts[0] === manager)
        await contract.methods.managerContribute().send({
          from: accounts[0],
          value: web3.utils.toWei(value, "ether"),
        });
      else if (accounts[0] === freelancer.toLowerCase() || accounts[0] === freelancer)
        await contract.methods.freelancerContribute().send({
          from: accounts[0],
          value: web3.utils.toWei(value, "ether"),
        });
      else
        throw new Error("You are not authenticated to contribute to this contract")
      // this.setState({ loading: false, errorMessage: "" });
      setLoading(false);
      setErrorMessage("");
      Router.replace(`/contracts/${address}`);
      // this.setState({ errorMessage: "" });
      setErrorMessage("");
    } catch (err) {
      // this.setState({ errorMessage: err.message });
      setErrorMessage(err.message);
    }
    // this.setState({ loading: false });
    setLoading(false);
  };

  const onSubmitProject = async (event) => {
    event.preventDefault();
    const contract = Contract(address);
    // this.setState({ loading: true });
    setLoadingProject(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log(accounts[0], manager, freelancer);
      // if (accounts[0] === manager.toLowerCase() || accounts[0] === manager)
        await contract.methods.setProject(project).send({
          from: accounts[0],
          // value: web3.utils.toWei(value, "ether"),
        });
      // else if (accounts[0] === freelancer.toLowerCase() || accounts[0] === freelancer)
      //   await contract.methods.freelancerContribute().send({
      //     from: accounts[0],
      //     value: web3.utils.toWei(value, "ether"),
      //   });
      // else
      //   throw new Error("You are not authenticated to contribute to this contract")
      // this.setState({ loading: false, errorMessage: "" });
      setLoadingProject(false);
      setErrorMessageProject("");
      Router.replace(`/contracts/${address}`);
      // this.setState({ errorMessage: "" });
      setErrorMessageProject("");
    } catch (err) {
      // this.setState({ errorMessage: err.message });
      setErrorMessageProject(err.message);
    }
    // this.setState({ loading: false });
    setLoadingProject(false);
  };

  // render() {
  return (
    <>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            onChange={(e) => {
              // this.setState({ value: e.target.value });
              setValue(e.target.value);
            }}
            value={value}
            labelPosition="right"
          />
        </Form.Field>
        <Button loading={loading} type="submit" primary>
          Contribute!
        </Button>
        <Message error header="Oops" content={errorMessage} />
      </Form>
      <br />
      <br />
      <Form onSubmit={onSubmitProject} error={!!errorMessageProject}>
        <Form.Field>
          <label>Change Project Name</label>
          <Input
            // label="ether"
            onChange={(e) => {
              // this.setState({ value: e.target.value });
              setProject(e.target.value);
            }}
            value={project}
            // labelPosition="right"
          />
        </Form.Field>
        <Button loading={loadingProject} type="submit" primary>
          Change!
        </Button>
        <Message error header="Oops" content={errorMessageProject} />
      </Form>
    </>
  );
  // }
}
