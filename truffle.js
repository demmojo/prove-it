var HDWalletProvider = require("truffle-hdwallet-provider");
var seedWords = "rate carry ocean icon nature inflict shield pupil dragon juice drift ladder";
var apikey = "v3/6167802133e04aaf86c467a858b56781"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  mocha: {
    useColors: true
  },

  networks: {

    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },

    ropsten: {
      provider: function () {
        return new HDWalletProvider(seedWords, "https://ropsten.infura.io/");
      },
      network_id: '3',
      gas: 4500000
    },

    rinkeby: {
      provider: function () {
        return new HDWalletProvider(seedWords, "https://rinkeby.infura.io/" + apikey);
      },
      network_id: '4',
      gas: 4500000
    }

  },
  compilers: {
    solc: {
      version: "0.4.24" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }

};
