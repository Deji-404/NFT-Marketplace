//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/5d5bcb8c7db04586a4681e430a14452e",
      accounts: ["5f929771f58ac15473e90a58ac6b4a8a379d69597f167c943c476816b1b6afd0"]
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "E2Z7QI5DSDBH5XSD4NY7M16BYHVA1A5QDK"
    },
    customChains: [
      {
        network: "polygonMumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com",
          browserURL: "https://mumbai.polygonscan.com"
        }
      }
    ]
  },
  solidity: "0.8.19",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
