import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import ContractFactory from "../../ethereum/factory";
// import Layout from "../components/Layout";
import Link from "next/link";

export default class index extends Component {
  static async getInitialProps() {
    const contract = await ContractFactory.methods.getDeployedContract().call();
    return { contract };
  }
  renderContracts() {
    const items = this.props.contract.map((address) => {
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

  render() {
    return (
    //   <Layout>
        <div>
          <h3>Open Contracts</h3>
          <Link href="/contracts/new">
            <Button
              floated="right"
              content="Create Contract"
              icon="add circle"
              primary
            />
          </Link>
          {this.renderContracts()}
        </div>
    //   </Layout>
    );
  }
}
