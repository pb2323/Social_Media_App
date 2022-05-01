import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0x4F6ca93e686916756B23B169Ab85f8b5f36cdc9E"
);

export default instance;
