import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

export const polygonInstance = new web3.eth.Contract(
    ContractFactory.abi,
    "0xd0e65f027aee80857f800f3357df7fe5950f51bd"
);

export const rinkebyInstance = new web3.eth.Contract(
    ContractFactory.abi,
    "0xd0e65f027aee80857f800f3357df7fe5950f51bd"
);