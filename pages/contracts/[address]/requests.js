import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { Button, Table } from "semantic-ui-react";
// import Layout from "../../../components/Layout";
import Contract from "../../../ethereum/contract";
import RequestRow from "../../../components/Contracts/RequestRow";
import { useRouter } from 'next/router';

export default function Requests({ Wallet }) {
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
    const [manager, setManager] = useState("")
    const [freelancer, setFreelancer] = useState("")
    const { Header, Row, HeaderCell, Body } = Table;

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                // const { address } = props.query;
                const contract = Contract(address);
                const manager = await contract.methods.manager().call();
                const freelancer = await contract.methods.freelancer().call();
                const requestsCount = await contract.methods.getRequestsCount().call();
                
                if (Wallet !== manager && Wallet !== freelancer) {
                    router.push("/")
                    return;
                }
                // const approversCount = await contract.methods.approversCount().call();
                let Requests = [];
                let temp;
                for (let index = 0; index < requestsCount; index++) {
                    temp = await contract.methods.requests(index).call();
                    Requests.push(temp);
                }
                setRequests(Requests)
                setRequestsCount(requestsCount)
                setManager(manager)
                setFreelancer(freelancer)
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
                    manager={manager}
                    Wallet={Wallet}
                />
            ))
        );
    }

    // render() {
    return (
        <>
            {/* <Layout> */}
            <h3>Requests</h3>
            <Link href={`/contracts/${address}`}>
                <Button style={{ marginBottom: "10px" }} primary>
                    Back
                </Button>
            </Link>
            <Link href={`/contracts/${address}/requests/new`}>
                <Button
                    // disabled={Wallet === manager}
                    floated="right" style={{ marginBottom: "10px" }} primary>
                    Add Request
                </Button>
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
                Found <strong>{requestsCount}</strong> Requests
            </div>
            {/* </Layout> */}
        </>
    );
    // }
}
