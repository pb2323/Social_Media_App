import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
import { Button, Card, Grid } from "semantic-ui-react";
import Contract from "../../ethereum/contract";
import web3 from "../../ethereum/web3";
import ContractForm from "../../components/Contracts/ContractForm";
import Link from "next/link";
import { useRouter } from 'next/router';
import { add } from "lodash";

export default function show() {
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
                header: balance,
                meta: "Contract Balance (ethers)",
                description:
                    "The balance is how much money this contract has left to spend.",
            },
            {
                header: freelancer,
                meta: "Address of the Freelancer",
                description:
                    "The balance is how much money this contract has left to spend.",
                style: { overflowWrap: "break-word" },
            },
            {
                header: !!project ? project : address,
                meta: "Name of the project",
                description:
                    "The balance is how much money this contract has left to spend.",
                style: { overflowWrap: "break-word" },
            },
            {
                header: managerContributed ? "YES" : "NO",
                meta: "Manager contribution status",
                // description:
                //     "The balance is how much money this contract has left to spend.",
            },
            {
                header: freelancerContributed ? "YES" : "NO",
                meta: "Freelancer contribution status",
                description:
                    "The balance is how much money this contract has left to spend.",
            },
        ];
        console.log(items);
        return <Card.Group items={items} />;
    }

    // render() {
    return (
        <>
            {/* //   <Layout> */}
            <h3>Contract Show</h3>
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
