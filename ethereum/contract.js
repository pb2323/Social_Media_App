const web3 = require("./web3");
const SmartContract = require("./build/SmartContract.json");

const SmartContractInstance = (address) => {
  const instance = new web3.eth.Contract(
    SmartContract.abi,
    address
  );
  return instance;
};

module.exports = SmartContractInstance;
