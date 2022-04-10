pragma solidity ^0.4.17;

contract ContractFactory {
    mapping(address=>address[]) public deployedContracts;

    function createContract(uint256 minimum, address freelancer) public {
        address newContract = new SmartContract(minimum, msg.sender, freelancer);
        deployedContracts[msg.sender].push(newContract);
        deployedContracts[freelancer].push(newContract);
    }

    function getDeployedContract() public view returns (address[]) {
        return deployedContracts[msg.sender];
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
    address public manager;
    address public freelancer;
    uint256 public minimumContribution;
    bool public freelancerContributed;
    bool public managerContributed;
    string public project;

    // modifier restricted() {
    //     require(msg.sender == manager && freelancerContributed == true);
    //     _;
    // }

    function SmartContract(uint256 minimum, address creator, address Freelancer) public {
        manager = creator;
        minimumContribution = minimum;
        freelancer = Freelancer;
    }

    function setProject(string projectName) public {
        project = projectName;
    }

    function freelancerContribute() public payable {
        require(msg.value >= minimumContribution/2 && !freelancerContributed);
        freelancerContributed = true;
    }

    function managerContribute() public payable {
        require(msg.value == minimumContribution && !managerContributed);
        managerContributed = true;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public {
        require(msg.sender == freelancer && freelancerContributed);
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
        require(msg.sender == manager && freelancerContributed == true);
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
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            manager,
            freelancer
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
