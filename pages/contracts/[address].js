import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
import { Button, Card, Grid } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
import ContractForm from "../../components/Contracts/ContractForm";
import Link from "next/link";
import { useRouter } from 'next/router';
import { add } from "lodash";

export default function show({ Wallet }) {
    // static async getInitialProps(props) {
    //     const contract = Contract(props.query.address);
    //     const summary = await contract.methods.getSummary().call();
    //     return {
    //         minimumContribution: summary[0],
    //         balance: summary[1],
    //         requestsCount: summary[2],
    //         approversCount: summary[3],
    //         manager: summary[4],
    //         address: props.query.address,
    //     };
    // }
    const [minimumContribution, setMinimumContribution] = useState(0);
    const [balance, setBalance] = useState(0);
    const [requestsCount, setRequestsCount] = useState(0);
    const [manager, setManager] = useState("");
    const [freelancer, setFreelancer] = useState("")
    const [project, setProject] = useState("")
    const [managerContributed, setManagerContributed] = useState(false)
    const [freelancerContributed, setFreelancerContributed] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");
    const { address } = router.query

    useEffect(() => {
        const getSummary = async () => {
            setLoading(true);
            const contract = Contract(address);
            const summary = await contract.methods.getSummary().call();
            console.log(Wallet, summary[3], summary[4]);
            if(Wallet !== summary[3] && Wallet !== summary[4]) {
                router.push("/")
                return;
            }
            setMinimumContribution(summary[0])
            setBalance(summary[1]);
            setRequestsCount(summary[2])
            setManager(summary[3])
            setFreelancer(summary[4])
            setProject(summary[5])
            setManagerContributed(summary[6])
            setFreelancerContributed(summary[7])
            setLoading(false);
        };
        getSummary();
        console.log(Wallet, manager, freelancer);
    }, [])

    const renderCards = () => {
        // const {
        //     minimumContribution,
        //     balance,
        //     requestsCount,
        //     approversCount,
        //     manager,
        // } = this.props;
        const items = [
            {
                header: manager,
                meta: "Address of the Manager",
                description:
                    "The manager created this contract and has the ability to approve transfer request from the contract.",
                style: { overflowWrap: "break-word" },
            },
            {
                header: Wallet === manager ? minimumContribution : minimumContribution / 2,
                meta: "Minimum Contribution (wei)",
                description:
                    Wallet === manager ? "You must contribute this much wei as a gurantee to the freelancer" : "You must contribute this much wei as a gurantee to the manager",
            },
            {
                header: requestsCount,
                meta: "Number of requests",
                description:
                    "A request tries to withdraw money from the contract. Requests must be approved by the manager",
            },
            {
                header: balance,
                meta: "Contract Balance (wei)",
                description:
                    "The balance is how much money this contract has left to spend.",
            },
            {
                header: freelancer,
                meta: "Address of the Freelancer",
                description:
                    "The freelancer will work on the project assigned and has the ability to create requests for transfer of wei.",
                style: { overflowWrap: "break-word" },
            },
            {
                header: !!project ? project : address,
                meta: "Name of the project",
                description:
                    "The project name decided. Both the parties have ability to change the project name.",
                style: { overflowWrap: "break-word" },
            },
            {
                header: managerContributed ? "YES" : "NO",
                meta: "Manager contribution status",
                description:
                    "The manager has contributed to the contract",
            },
            {
                header: freelancerContributed ? "YES" : "NO",
                meta: "Freelancer contribution status",
                description:
                    "The freelancer has contributed to the contract",
            },
        ];
        // console.log(items);
        return <Card.Group items={items} />;
    }

    // render() {
    return (
        <>
            {/* //   <Layout> */}
            <Link href='/contracts'><Button primary style={{ marginTop: '10px', marginBottom: '10px' }}>Show contracts</Button></Link>
            <Grid>
                <Grid.Row>
                    <Grid.Column width="10">{renderCards()}</Grid.Column>
                    <Grid.Column width="6">
                        <ContractForm manager={manager} freelancer={freelancer} address={address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link href={`${address}/requests`}>
                            {/* <a> */}
                            <Button primary>View Requests</Button>
                            {/* </a> */}
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {/* </Layout> */}
        </>
    );
    // }
}
