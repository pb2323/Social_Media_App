const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/ContractFactory.json");

const env = process.argv[2]
const provider = (env === 'ethereum' || env === 'Ethereum') ? 'https://rinkeby.infura.io/v3/8d6c93f8a12343899af966a5f99c85fa' : 'https://polygon-mumbai.infura.io/v3/8d6c93f8a12343899af966a5f99c85fa'
const chainId = (env === 'ethereum' || env === 'Ethereum') ? 4 : 80001
const provider = new HDWalletProvider(
    "spider outside fox world hip disease cave mechanic scorpion square apple lamp",
    provider
);
const web3 = new Web3(provider);

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
                // gasPrice: '1000000000000',
                chainId: chainId,

            });
        console.log("Contract deployed to ", result.options.address);
    } catch (err) {
        console.log(err);
    }

};

deploy();
