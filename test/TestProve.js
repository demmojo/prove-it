var Prove = artifacts.require('Prove.sol');
var Web3 = require('web3');

contract('Prove contract test suite', function (accounts) {

    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let docTags = web3.fromAscii("Blockchain, Ethereum, Solidity")

    // Test retrieve document method on an empty data store. When none of the users have uploaded any document in the  contract.
    // the default value for docHashs is 0x0
    it('Test: File retrieve on Empty Contract', function () {

        let docHash = "0xf50aab0582320e332b469f450e38f45e77f0926dfe07cf56ee661707207a5419";
        const account_one = accounts[0];
        return Prove.deployed().then(function (instance) {
            return instance.retrieveFile.call(docHash, { from: account_one });
        }).then(function (result) {
            let expected = 0x0;
            let actual = result[0];
            console.log("actual0000000000000", actual);
            assert.equal(actual, expected, 'None if the file not exist in blockchain. Default value for bytes32 should be returned 0x0');
        })
    });

    // Test the document upload functionality for Prove.sol contract.
    // this test ensures user is be able to upload the document and retrieve the document succesfully
    it('Test: File upload functionality', function () {

        let docHash = "0x83fe5282995e8e08e1acc5104b3178637b33f0f0b1b4942e466cca005245e7ee";
        let docOwnerName = "0x7372656573617261646869";
        let ipfsHash = "QmUd5cKE6843KMEtnFQ9CvfHUKfzQ4E1VSsj1ihkHBgk7i";
        let account_one = accounts[0];

        return Prove.deployed().then(function (instance) {
            instance.uploadFile(docHash, docOwnerName, ipfsHash, docTags, { from: account_one });
            return instance.retrieveFile.call(docHash, { from: account_one });
        }).then(function (result) {
            //console.log("result = ", result);
            //console.log("name = ", web3.toAscii(result[1]));
            let expected = docHash;
            let actual = result[0];
            assert.equal(actual, expected, 'File Successfully Added');
        })
    });

    // Test fall back function
    it('Test fallback function', function () {

        let account_one = accounts[6];
        let contractInstance;
        return Prove.deployed().then((instance) => {
            contractInstance = instance;
            return instance.sendTransaction({ from: account_one, value: web3.toWei(1, "ether") });
        }).then((result) => {
            //console.log("result", result);
            //console.log("contract address:",contractInstance.address);
        })

    })

})
