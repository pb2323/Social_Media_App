import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

let instance;

const setInstance = async () => {
  if (typeof window != "undefined") {
    const networkVersion = await ethereum.request({ method: 'net_version' })

    if (networkVersion == '80001')
      instance = new web3.eth.Contract(
        JSON.parse(ContractFactory.interface),
        "0x8dbb37Dd2ec182A5B772d221a60fE34cB54DDfe4"
      );
    else
      instance = new web3.eth.Contract(
        JSON.parse(ContractFactory.interface),
        "0x733Bb7A4d257a910E63aF3A542eF860292968B0c"
      );
  }
  else
    instance = undefined
}

setInstance()

export default instance;
