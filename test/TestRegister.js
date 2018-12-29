var Register = artifacts.require('Register.sol');
var Prove = artifacts.require('Prove.sol');

contract('Register contract test suit', function (accounts) {

    // Test cases ensures that the owner is iniliazed while deploying the contract. 
    // Validates the consturctor argument.
    it('Test constructor argument', function () {
        return Register.deployed().then((instance) => {
            return instance.owner.call({ from: accounts[0] });
        }).then((owner) => {
            const expected = accounts[0];
            const actual = owner;
            assert.equal(expected, actual, "owner should be set to the account that deployed contract");
        })
    });

    // This test validates the current version of the contract address is set to the value passed in the deployment script
    it('Test current version of the contract', function () {
        return Register.deployed().then((instance) => {
            return instance.getCurrentVersion.call({ from: accounts[0] });
        }).then((contractAddress) => {
            const expected = Prove.address;
            const actual = contractAddress;
            assert.equal(expected, actual, "Current version should be set to Prove contract address");
        })
    });

    // This test ensures that the owner is able to change the current version of the contract.
    it('Test change current version of the contract by owner', function () {
        const newVersion = "0xaca0000620f00001e7200003b3a00004e140000d";
        const account_one = accounts[0];
        return Register.deployed().then((instance) => {
            instance.changeContractVersion(newVersion, { from: account_one });
            return instance.getCurrentVersion.call({ from: account_one });
        }).then((currentVersion) => {
            const expected = newVersion;
            const actual = currentVersion;
            assert.equal(expected, actual, "Current version should change to new version");
        })
    });

})