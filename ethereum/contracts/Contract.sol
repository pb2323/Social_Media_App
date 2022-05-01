pragma solidity ^0.4.17;

contract ContractFactory {
    mapping(address=>address[]) public deployedContracts;

    function createContract(uint256 minimum, address freelancer, address guarantor) public {
        address newContract = new SmartContract(minimum, msg.sender, freelancer, guarantor);
        deployedContracts[msg.sender].push(newContract);
        deployedContracts[freelancer].push(newContract);
    }

    function getDeployedContract(address sender) public view returns (address[]) {
        return deployedContracts[sender];
    }
}

contract SmartContract {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool completed;
    }

    Request[] public requests;
    address public client;
    address public freelancer;
    address public guarantor;
    uint256 public minimumContribution;
    bool public freelancerContributed;
    bool public clientContributed;
    string public project;

    // modifier restricted() {
    //     require(msg.sender == client && freelancerContributed == true);
    //     _;
    // }

    function SmartContract(uint256 minimum, address creator, address Freelancer, address Guarantor) public {
        client = creator;
        minimumContribution = minimum;
        freelancer = Freelancer;
        guarantor = Guarantor;
    }

    function setProject(string projectName) public {
        project = projectName;
    }

    function freelancerContribute() public payable {
        require((msg.value >= minimumContribution/2 && !freelancerContributed)||(freelancerContributed));
        freelancerContributed = true;
    }

    function clientContribute() public payable {
        require((msg.value == minimumContribution && !clientContributed) || (clientContributed));
        clientContributed = true;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public {
        require((msg.sender == freelancer && freelancerContributed) || (msg.sender == guarantor));
        Request memory newRequest =
            Request({
                description: description,
                value: value,
                recipient: recipient,
                completed: false
            });
        requests.push(newRequest);
    }

    function finalizeRequest(uint256 index) public {
        require((msg.sender == client && freelancerContributed == true) || (msg.sender == guarantor));
        Request storage request = requests[index];
        require(request.completed == false);
        request.recipient.transfer(request.value);
        request.completed = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            address,
            address,
            string,
            bool,
            bool,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            client,
            freelancer,
            project,
            clientContributed,
            freelancerContributed,
            guarantor
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    function getAddress() public view returns(address, address, address){
        return (freelancer, client, guarantor);
    }
}
