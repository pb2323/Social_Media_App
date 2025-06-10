const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/ContractFactory.json");

const env = process.argv[2]
const providerUrl = (env === 'ethereum' || env === 'Ethereum') ? 'https://rinkeby.infura.io/v3/8d6c93f8a12343899af966a5f99c85fa' : 'https://polygon-amoy.infura.io/v3/2A9Pbnnry04uT3G02Pp9iBB2p6G'
const chainId = (env === 'ethereum' || env === 'Ethereum') ? 4 : 80002
const provider = new HDWalletProvider(
    "chest lawn flee brush confirm ketchup price pelican symptom crawl bullet relief",
    providerUrl
);
const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        const gasPrice = await web3.eth.getGasPrice();
        const gasRequired = 300000; // From your gas limit
        const totalCost = BigInt(gasPrice) * BigInt(gasRequired);
        
        console.log("Current balance:", web3.utils.fromWei(balance, 'ether'), "ETH");
        console.log("Gas price:", web3.utils.fromWei(gasPrice, 'gwei'), "gwei");
        console.log("Gas required:", gasRequired);
        console.log("Total cost required:", web3.utils.fromWei(totalCost.toString(), 'ether'), "ETH");
        console.log("Attempting to deploy from account ", accounts[0]);
        
        const result = await new web3.eth.Contract(
            compiledFactory.abi
        )
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({
                from: accounts[0], 
                gas: '3000000',
                chainId: chainId,
            });
        console.log("Contract deployed to ", result.options.address);
    } catch (err) {
        console.log(err);
    }
};

deploy();
