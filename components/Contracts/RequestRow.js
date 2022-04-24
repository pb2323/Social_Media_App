import React, { Component, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

export default function RequestRow({ id, request, address, Wallet, manager }) {

  const Router = useRouter();
  const { Row, Cell } = Table;
  const [loading, setLoading] = useState(false)
  // const { address } = Router.query

  // const onApprove = async () => {
  //   const contract = Contract(address);
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   await contract.methods
  //     .approveRequest(id)
  //     .send({ from: accounts[0] });

  //   Router.replace(`/contracts/${address}/requests`);
  // };

  const onApprove = async () => {
    const contract = Contract(address);
    setLoading(true)
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await contract.methods
      .finalizeRequest(id)
      .send({ from: accounts[0] });
    setLoading(false)
    Router.reload(`/contracts/${address}/requests`);
  };

  // render() {
  // const { id, request, approversCount } = this.props;
  const isFinalized = false;
  return (
    <Row
      disabled={request.completed}
      positive={!request.completed && isFinalized}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      {/* <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell> */}
      <Cell>{request.value}</Cell>
      <Cell>{request.recipient}</Cell>
      {/* <Cell>{request.approvalCount + "/" + approversCount}</Cell> */}
      {/* <Cell>
          {request.completed ? null : (
            <Button color="green" basic onClick={onApprove}>
              Approve
            </Button>
          )}
        </Cell> */}
      <Cell>
        {request.completed ? null : (
          <Button color="teal" disabled={Wallet !== manager} loading={loading} basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
    </Row>
  );
  // }
}
