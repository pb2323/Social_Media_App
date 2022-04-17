import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
// import Layout from "../../../components/Layout";
import Contract from "../../../ethereum/contract";
import RequestRow from "../../../components/Contracts/RequestRow";
import { useRouter } from 'next/router';

export default function Requests() {
    // static async getInitialProps(props) {
    //     try {
    //         const { address } = props.query;
    //         const contract = Contract(address);
    //         const requestsCount = await contract.methods.getRequestsCount().call();
    //         const approversCount = await contract.methods.approversCount().call();
    //         let Requests = [];
    //         let temp;
    //         for (let index = 0; index < requestsCount; index++) {
    //             temp = await contract.methods.requests(index).call();
    //             Requests.push(temp);
    //         }
    //         return { address, requests: Requests, requestsCount, approversCount };
    //     } catch (err) {
    //         const { address } = props.query;
    //         return { address };
    //     }
    // }
    const router = useRouter()
    const { address } = router.query
    const [requests, setRequests] = useState([])
    const [requestsCount, setRequestsCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const { Header, Row, HeaderCell, Body } = Table;

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                // const { address } = props.query;
                const contract = Contract(address);
                const requestsCount = await contract.methods.getRequestsCount().call();
                // const approversCount = await contract.methods.approversCount().call();
                let Requests = [];
                let temp;
                for (let index = 0; index < requestsCount; index++) {
                    temp = await contract.methods.requests(index).call();
                    Requests.push(temp);
                }
                setRequests(Requests)
                setRequestsCount(requestsCount)
                setLoading(false)
                // return { address, requests: Requests, requestsCount, approversCount };
            } catch (err) {
                // const { address } = props.query;
                // return { address };
                console.error(err.message)
            }
        }
        getData();
    }, [])

    const renderRow = () => {
        return (
            requests &&
            requests.map((x, index) => (
                <RequestRow
                    key={index}
                    id={index}
                    request={x}
                    address={address ? address : ""}
                />
            ))
        );
    }

    // render() {
        return (
            <>
                {/* <Layout> */}
                <h3>Requests</h3>
                <Link href={`/contracts/${address}/requests/new`}>
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
                            {/* <HeaderCell>Approval Count</HeaderCell> */}
                            {/* <HeaderCell>Approve</HeaderCell> */}
                            <HeaderCell>Approve</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{renderRow()}</Body>
                </Table>
                <div>
                    Found <strong>{requests.length}</strong> Requests
                </div>
                {/* </Layout> */}
            </>
        );
    // }
}
