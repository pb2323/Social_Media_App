const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/ContractFactory.json");

const provider = new HDWalletProvider(
    "spider outside fox world hip disease cave mechanic scorpion square apple lamp",
    "https://rinkeby.infura.io/v3/8d6c93f8a12343899af966a5f99c85fa"
);

const web3 = new Web3(process.env.MODE === 'local' ? (new Web3.providers.HttpProvider("http://127.0.0.1:7545")) : provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log(balance);
        console.log("Attempting to deploy from account ", accounts[0]);
        const result = await new web3.eth.Contract(
            JSON.parse(compiledFactory.interface)
        )
            .deploy({ data: "0x" + compiledFactory.bytecode })
            .send({
                from: accounts[0], gas: '3000000',
                // gasPrice: '1000000000000'
            });
        console.log("Contract deployed to ", result.options.address);
    } catch (err) {
        console.log(err);
    }

};

deploy();
