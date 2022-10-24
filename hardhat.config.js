require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  gasReporter: {
    enabled: true,
    gasPriceApi: "https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice",
    currency: 'USD',
    coinmarketcap: process.env.CMC_APIKEY
  },
  networks: {
    fuji: {
      url: process.env.FUJI_WEB3_PROVIDER_ADDRESS ?? "",
      accounts: [process.env.MNEMONIC ?? ""],
    },
    ropsten: {
      url: process.env.ROPSTEN_RPC_URL ?? "",
      accounts: [process.env.MNEMONIC ?? ""],
    },
    mainnet: {
      url: process.env.WEB3_PROVIDER_ADDRESS ?? "",
      // accounts: [process.env.MAINNET_PRIVATE_KEY ?? ""],
    },
    hardhat: {
      chainId: 1337,
      // gasPrice: 1,
      // initialBaseFeePerGas: 0,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },
};
