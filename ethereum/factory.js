const web3 = require("./web3");
const ContractFactory = require("./build/ContractFactory.json");

let instance = null;

if (typeof window !== "undefined" && window.ethereum) {
  try {
    if (web3 && web3.eth) {
      instance = new web3.eth.Contract(
        ContractFactory.abi,
        "0xd0e65f027aee80857f800f3357df7fe5950f51bd"
      );
    } else {
      console.error("Web3 is not properly initialized");
    }
  } catch (error) {
    console.error("Error creating contract instance:", error);
  }
}

module.exports = instance;
