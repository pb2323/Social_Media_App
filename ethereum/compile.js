const fs = require("fs-extra");
const solc = require("solc");
const path = require("path");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts", "Contract.sol");
const source = fs.readFileSync(contractPath, "utf8");
// console.log(source);
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath);
// console.log(output);
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
