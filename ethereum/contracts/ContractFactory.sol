// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SmartContract.sol";

contract ContractFactory {
    mapping(address => address[]) public deployedContracts;
    mapping(address => address[]) public guarantorContracts;

    event ContractCreated(address indexed creator, address contractAddress);

    function createContract(uint256 minimum, address freelancer, address guarantor) public {
        SmartContract newContract = new SmartContract(minimum, msg.sender, freelancer, guarantor);
        address contractAddress = address(newContract);
        deployedContracts[msg.sender].push(contractAddress);
        deployedContracts[freelancer].push(contractAddress);
        guarantorContracts[guarantor].push(contractAddress);
        emit ContractCreated(msg.sender, contractAddress);
    }

    function getDeployedContracts(address user) public view returns (address[] memory) {
        return deployedContracts[user];
    }

    function getGuarantorContracts(address user) public view returns (address[] memory) {
        return guarantorContracts[user];
    }
}
