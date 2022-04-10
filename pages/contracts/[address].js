import React, { Component } from "react";
// import Layout from "../../components/Layout";
import { Button, Card, Grid } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
import ContractForm from "../../components/Contracts/ContractForm";
import Link from "next/link";

export default class show extends Component {
    static async getInitialProps(props) {
        const contract = Contract(props.query.address);
        const summary = await contract.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address,
        };
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
        } = this.props;
        const items = [
            {
                header: manager,
                meta: "Address of the Manager",
                description:
                    "The manager created this contract and can create requests to withdraw money",
                style: { overflowWrap: "break-word" },
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description:
                    "You must contribute atleast this much wei to become an approver",
            },
            {
                header: requestsCount,
                meta: "Number of requests",
                description:
                    "A request tries to withdraw money from the contract. Requests must be approved by the users",
            },
            {
                header: approversCount,
                meta: "Number of approvers",
                description:
                    "Number of people who have already donated to this contract",
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: "Contract Balance (ethers)",
                description:
                    "The balance is how much money this contract has left to spend.",
            },
        ];
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <>
                {/* //   <Layout> */}
                <h3>Contract Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="10">{this.renderCards()}</Grid.Column>
                        <Grid.Column width="6">
                            <ContractForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link href={`${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {/* </Layout> */}
            </>
        );
    }
}
