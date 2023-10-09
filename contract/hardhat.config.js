require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/26C67HRTkef4E33TSyve0u3zVkDNReiL",
      accounts: [
        "e2d9f92b547b55053ce7fd5995536053c081a08322d5bba5f6221f034e642ede",
      ],
    },
  },
};
