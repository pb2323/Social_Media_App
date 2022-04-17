import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0x66fd4F11B52f04E9cC31E14E396eCbd35EB7b899"
);

export default instance;
