import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0x0204B5cD20502464ebF9A8E62db708479879Ca27"
);

export default instance;
