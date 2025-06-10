const fs = require("fs-extra");
const solc = require("solc");
const path = require("path");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractFactoryPath = path.resolve(__dirname, "contracts", "ContractFactory.sol");
const smartContractPath = path.resolve(__dirname, "contracts", "SmartContract.sol");

const contractFactorySource = fs.readFileSync(contractFactoryPath, "utf8");
const smartContractSource = fs.readFileSync(smartContractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "ContractFactory.sol": {
      content: contractFactorySource
    },
    "SmartContract.sol": {
      content: smartContractSource
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  console.error(output.errors);
}

fs.ensureDirSync(buildPath);

// Process ContractFactory.sol
if (output.contracts["ContractFactory.sol"]) {
  for (let contractName in output.contracts["ContractFactory.sol"]) {
    fs.outputJsonSync(
      path.resolve(buildPath, contractName + ".json"),
      output.contracts["ContractFactory.sol"][contractName]
    );
  }
}

// Process SmartContract.sol
if (output.contracts["SmartContract.sol"]) {
  for (let contractName in output.contracts["SmartContract.sol"]) {
    fs.outputJsonSync(
      path.resolve(buildPath, contractName + ".json"),
      output.contracts["SmartContract.sol"][contractName]
    );
  }
}
