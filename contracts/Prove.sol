pragma solidity ^0.4.22;

import "./ProveDatabase.sol";
import "./Mortal.sol";

/** @title Proving related tasks. */
contract Prove is Mortal{
    
    address public storageDatabase;
    bool public stopped = false;

    // document ipfs hash and document hash and timestamp 
    struct File {
        string ipfsHash;
        bytes32 docHash;
        uint documentTimeStamp;
    }

    // Constructor started with the storage contract address. 
    constructor(address _storageDatabase) public {
        owner = msg.sender;
        storageDatabase = _storageDatabase;
    }

    // Change the address of the storage contract by owner.
    function setstorageDatabase(address _storageDatabase) public onlyOwner returns(bool){
        storageDatabase = _storageDatabase;
        return true;
    }

    //Events for logging
    event LogFallback(address _senderaddr,uint _value);
    event LogUploadFile(address _addr, bytes32 _userName, bytes32 _dochash, uint _docTimestamp, bytes _ipfsHash, string _notes);

    /** @dev Uploads the document and stores data within the storage contract.  
        * @param _docHash hash of the document.
        * @param _userName username of the document owner.
        * @param _ipfsHash document hash returned by IPFS.
        * @param _docTags document tags.
        * @return status true/false.
        */
    function uploadFile(bytes32 _docHash, bytes32 _userName, bytes _ipfsHash,bytes _docTags) public returns(bool) {
        
        require(_docHash != 0x0,"Please enter a correct document hash.");
        require(_userName.length <= 32,"The userName should be less than 32 bytes");
        require(_ipfsHash.length <= 64,"The ipfsHash should be less than 64 bytes");
        require(_docTags.length <= 32,"The docTags should be less than 32 bytes");
        
        bool status;
        ProveDatabase proveDatabase = ProveDatabase(storageDatabase);

        status = proveDatabase.addFile(msg.sender,_docHash,_userName,_ipfsHash,_docTags);
        //Log upload of the document
        emit LogUploadFile(msg.sender, _userName,_docHash, block.timestamp,_ipfsHash,"upload");

        return status;
    }
    
    /** @dev Retrieve document details.
        * @param _docHash hash of the document.
        * @return docHash hash of the document.
        * @return userName name of the document owner.
        * @return documentTimeStamp registration timestamp of document.
        * @return ipfsHash IPFS document hash.
        * @return docTags document description tags.
        */
    function retrieveFile(bytes32 _docHash) public view returns(bytes32,bytes32,uint,bytes,bytes) {
        
        require(_docHash != 0x0, "Please enter a correct document hash.");
        ProveDatabase proveDatabase = ProveDatabase(storageDatabase);
        bytes32 docHash;
        bytes32 userName;
        uint documentTimeStamp;
        bytes memory ipfsHash;
        bytes memory docTags;
        (docHash,userName,documentTimeStamp,ipfsHash,docTags) = proveDatabase.getFile(msg.sender,_docHash);
        return(docHash,userName,documentTimeStamp,ipfsHash,docTags);
    }

    /** @dev Returns every document owned by the sender. 
        * @return documentHashList list of document hashes.
        */
    function retrieveAllFiles() public view returns(bytes32[]){
        ProveDatabase proveDatabase = ProveDatabase(storageDatabase);
        bytes32[] memory documentHashList = proveDatabase.retrieveAllFiles(msg.sender);
        return documentHashList;
    }

    /** @dev Checks the balance of the contract account. 
        * @return balance contract ether amount.
        */
    function checkBalance() public view returns(uint){
        return address(this).balance;
    }

    /** @dev Allows the owner to withdraw ether from the contract account.  
        * @return status true/false.
        */
    function withdrawFunds() public onlyOwner returns(bool){
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
        return true;
    }

    // Fallback function to prevent calls with unknown data and functions. 
    // It is invoked when the call made to the contract does not match any function signatures.
    function () public payable {
        require(msg.data.length == 0,"Length of the message is not zero.");
        emit LogFallback(msg.sender,msg.value);
    }

}
