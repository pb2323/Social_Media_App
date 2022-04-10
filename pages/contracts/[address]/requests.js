import Link from "next/link";
import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
// import Layout from "../../../components/Layout";
import Contract from "../../../ethereum/contract";
import RequestRow from "../../../components/RequestRow";

export default class requests extends Component {
    static async getInitialProps(props) {
        try {
            const { address } = props.query;
            const contract = Contract(address);
            const requestsCount = await contract.methods.getRequestsCount().call();
            const approversCount = await contract.methods.approversCount().call();
            let Requests = [];
            let temp;
            for (let index = 0; index < requestsCount; index++) {
                temp = await contract.methods.requests(index).call();
                Requests.push(temp);
            }
            return { address, requests: Requests, requestsCount, approversCount };
        } catch (err) {
            const { address } = props.query;
            return { address };
        }
    }

    renderRow() {
        return (
            this.props.requests &&
            this.props.requests.map((x, index) => (
                <RequestRow
                    key={index}
                    id={index}
                    request={x}
                    address={this.props.address ? this.props.address : ""}
                    approversCount={
                        this.props.approversCount ? this.props.approversCount : ""
                    }
                />
            ))
        );
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                {/* <Layout> */}
                <h3>Requests</h3>
                <Link href={`/contracts/${this.props.address}/requests/new`}>
                    <a>
                        <Button floated="right" style={{ marginBottom: "10px" }} primary>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recepient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRow()}</Body>
                </Table>
                <div>
                    Found <strong>{this.props.requests.length}</strong> Requests
                </div>
                {/* </Layout> */}
            </>
        );
    }
}
