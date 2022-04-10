import web3 from "./web3";
import SmartContract from "./build/SmartContract.json";

const SmartContract = (address) => {
  const instance = new web3.eth.Contract(
    JSON.parse(SmartContract.interface),
    address
  );
  return instance;
};

export default SmartContract;
