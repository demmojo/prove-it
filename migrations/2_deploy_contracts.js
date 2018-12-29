var Mortal = artifacts.require("./Mortal.sol");
var ProveDatabase = artifacts.require("./ProveDatabase.sol");
var Prove = artifacts.require("./Prove.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function (deployer) {

  deployer.deploy(Mortal).then(() => {
    return deployer.deploy(ProveDatabase)
  }).then(() => {
    return deployer.deploy(Prove, ProveDatabase.address);
  }).then(() => {
    return deployer.deploy(Register, Prove.address);
  })

};
