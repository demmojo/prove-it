# Prove-it Dapp

## Overview
Ethereum prove-it dapp. The frontend is developed using ReactJS while the smart contracts are developed using Solidity.

Prove-it allows users to prove the existence and integrity of some data such as files, images or videos. 

The data is stored in a decentralized storage system called IPFS (InterPlanetary File System). The hash of the file as well as the description tags are stored in the smart contract which is later referenced in order to verify the authenticity of the data.

### User Stories:

#### Retrieving uploaded files
User logs in to the webapp.
The dapp identifies the user's ethereum address.
User clicks the 'Files' tab.
The dapp displays the files previously uploaded with detailed information.

#### Uploading files
User logs in to the webapp.
The dapp identifies the user's ethereum address.
User can upload a file and add descriptive tags of the data. 
The file is stored on IPFS and the hash of the file is stored in a smart contract.

#### Verifying files
User logs in to the webapp.
The dapp identifies the user's ethereum address.
User can verify a file either with its hash or by uploading the file. 
The file details are displayed if the file exists on the blockchain. 


A user logs into the web app. 
The app reads the user’s address and shows all of the data that they have previously uploaded.
The user can upload some data (pictures/video) to the app, as well as add a list of tags indicating the contents of the data.
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.
Users can privide a prove of a document by storing its hash in the blockchain. 

### Important Note
Files uploaded are stored in IPFS. Do not upload sensitive personal information. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Requirements

What things you need to install the software and how to install them

`nodejs` 
`npm` 
`Truffle` 
`MetaMask` 
`ganache-cli`
`truffle-privatekey-provider` 
`Solidity`
`git` 


#### Reference links

* [nodejs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04) - nodejs
* [git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04) - git
* [ganache-cli](https://github.com/trufflesuite/ganache-cli) - ganache
* [Truffle](https://truffleframework.com/docs/truffle/getting-started/installation) - git


### Installation

This is a step by step guide to set up the project.

Clone the project repository.

```
git clone https://github.com/demmojo/prove-it.git
```

Enter the project directory

```
cd prove-it
```

Install the node modules

```
npm install
```

Compile the smart contracts

```
truffle compile
```

Start the development blockchain network to work on a local network

```
ganache-cli
```

Migrate the smart contracts. The --reset option runs all the migration from the beginning.

```
truffle migrate --reset
```


Login to metamask with Ganache-cli seed phrases

```
copy the ganache-cli seed phrase and login to metamask and select localhost
```

Start the dapp

```
npm run start
```

A tab should pop up in your browser. Otherwise go to the following link.

```
http://localhost:3000/
```

## Running the tests

This section describes how to run the automated tests for this dapp. 

Enter the project root directory

```
cd prove-it
```

Run tests

```
truffle test
```

## Deployment

Follow the steps mentioned below to do testnet deployment.

1. Go to project directory and open truffle.js file
`cd prove-it/truffle.js`

2. Open metamask and assign the seed phrase to seedWords variable
`seedWords = "seed phrase"`

3. Go to command prompt and run the truffle migrate command
`truffle migrate --network rinkeby` 

4. Deployed the dapp in rinkeby testnet. Contract address are present in `prove-it/deployed_addresses.txt`.

## Built With

* [Solidity](https://reactjs.org/docs/getting-started.html) - Smart Contract Language
* [ReactJS](https://reactjs.org/docs/getting-started.html) - Frontend web framework 
* [IPFS](https://reactjs.org/docs/getting-started.html) - Decentralised Storage
* [Metamask](https://reactjs.org/docs/getting-started.html) - Browser Extension
* [coreui](https://coreui.io/v1/docs/getting-started/introduction/#reactjs) - Frontend Components
* [npm](https://www.npmjs.com/) - Package Management


## License

prove-it is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

