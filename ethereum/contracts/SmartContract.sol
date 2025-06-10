// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SmartContract {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
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

    constructor(
        uint256 _minimum,
        address _creator,
        address _freelancer,
        address _guarantor
    ) {
        client = _creator;
        freelancer = _freelancer;
        guarantor = _guarantor;
        minimumContribution = _minimum;
    }

    function setProject(string memory projectName) public {
        project = projectName;
    }

    function freelancerContribute() public payable {
        require(!freelancerContributed, "Already contributed");
        require(msg.value >= minimumContribution / 2, "Insufficient amount");
        freelancerContributed = true;
    }

    function clientContribute() public payable {
        require(!clientContributed, "Already contributed");
        require(msg.value == minimumContribution, "Incorrect amount");
        clientContributed = true;
    }

    function createRequest(string memory description, uint256 value, address payable recipient) public {
        require((msg.sender == freelancer && freelancerContributed) || (msg.sender == guarantor));
        requests.push(Request(description, value, recipient, false));
    }

    function finalizeRequest(uint256 index) public {
        require((msg.sender == client && freelancerContributed) || msg.sender == guarantor);
        Request storage request = requests[index];
        require(!request.completed, "Already completed");
        request.completed = true;
        request.recipient.transfer(request.value);
    }

    function getSummary() public view returns (
        uint256, uint256, uint256, address, address, string memory, bool, bool, address
    ) {
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

    function getAddress() public view returns (address, address, address) {
        return (freelancer, client, guarantor);
    }
}
