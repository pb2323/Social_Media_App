import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { Button, Table, Message } from "semantic-ui-react";
// import Layout from "../../../components/Layout";
import Contract from "../../../ethereum/contract";
import { SocketContext } from '../../../utils/Context'
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
    // const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { setLoading, loading } = useContext(SocketContext)
    const [manager, setManager] = useState("")
    const [freelancer, setFreelancer] = useState("")
    const [guarantor, setGuarantor] = useState("")
    const { Header, Row, HeaderCell, Body } = Table;

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                // const { address } = props.query;
                const contract = Contract(address);
                const addresses = await contract.methods.getAddress().call();
                const requestsCount = await contract.methods.getRequestsCount().call();

                if (Wallet !== addresses[0] && Wallet !== addresses[1] && Wallet !== addresses[2]) {
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
                setManager(addresses[1])
                setFreelancer(addresses[0])
                setGuarantor(addresses[2])
                setLoading(false)
                setErrorMessage("")
                // return { address, requests: Requests, requestsCount, approversCount };
            } catch (err) {
                // const { address } = props.query;
                // return { address };
                // console.error(err.message)
                setErrorMessage(err.message)
                setLoading(false)
            }
            setLoading(false)
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
                    guarantor={guarantor}
                    Wallet={Wallet}
                    setErrorMessage={setErrorMessage}
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
                    disabled={(Wallet !== freelancer && Wallet !== guarantor) || loading}
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
            <Message hidden={!!!errorMessage} error header="Oops" content={errorMessage} />
            {/* </Layout> */}
        </>
    );
    // }
}
