

const resolve = require("path").resolve;
const dotenvConfig = require("dotenv").config;

dotenvConfig({ path: resolve(__dirname, "../.env") });

const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!

  networks: {
   development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
   },
   bsctestnet: {
    provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://data-seed-prebsc-1-s1.binance.org:8545/'),
    network_id: "97",
    accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
  compilers: {
    solc: {
      version: "0.6.12"
    }
  }
};
