import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0xeB03efB84E0A8da9b91fd1386b7b646EB311aE03"
);

export default instance;
