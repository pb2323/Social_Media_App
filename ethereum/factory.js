import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0x733Bb7A4d257a910E63aF3A542eF860292968B0c"
);

export default instance;
