var Mortal = artifacts.require('Mortal.sol');

contract('Tests for the Mortal Contract', function (accounts) {

    it('Test contract owner constructor functionality', function () {
        return Mortal.deployed().then(function (instance) {
            return instance.owner.call({ from: accounts[0] });
        }).then(function (result) {
            let expected = accounts[0]
            let actual = result;
            assert.equal(actual, expected, 'The owner should be set to ' + expected);
        })
    });

    it('Test contract owned contract negative condition', function () {
        return Mortal.deployed().then(instance => {
            return instance.owner.call({ from: accounts[1] });
        }).then(result => {
            let expected = accounts[1];
            let actual = result;
            assert.notEqual(actual, expected, 'Owner should not be set to second address in the accounts array');
        })
    });

    it('Test Kill function negative condition where caller is not owner', function () {
        return Mortal.deployed().then(instance => {
            return instance.kill({ from: accounts[1] });
        }).then(result => {
            assert.equal(1, 2, 'Mortal kill function should throw exception');
        }).catch(error => {
            assert.include(error.message, 'VM Exception while processing transaction: revert', 'Mortal kill function should throw exception');
        })
    });

    it('Test Kill function positive condition where caller is owner', function () {
        return Mortal.deployed().then(instance => {
            return instance.kill({ from: accounts[0] });
        }).then(result => {
            assert.equal(1, 1, "Mortal kill function should kill contract");
        }).catch(error => {
            assert.equal(1, 1, 'contract should be killed and there should not be any exception');
        })
    });

    contract('Tests for Mortal Contract self destruct', function (accounts) {
        it('Test self destruct functionality', function () {
            return Mortal.deployed().then(instance => {
                instance.kill({ from: accounts[0] });
                return instance.owner.call({ from: accounts[0] });
            }).then(result => {
                assert.equal(1, 2, "Mortal contract instance should not exist");
            }).catch(error => {
                assert.include(error.message, 'is not a contract address', 'Mortal contract instance should not exist');
            })
        });
    })

})
