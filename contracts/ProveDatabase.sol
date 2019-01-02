pragma solidity ^0.4.24;

import "./Mortal.sol";

/** @title ProveDatabase contract manages the data for this entire application.
    The purpose of this ProveDatabase contract is the storage and retrieval of data 
    The data is isolated from the logic in order to implement upgradable design pattern
    */
contract ProveDatabase  is Mortal {
    
    //File idenfiers is a structure which stores the documented related information
    struct File {
        bytes32 docHash;
        bytes32 userName;
        uint docTimestamp;
        bytes ipfsHash;
        bytes docTags;
    }

    //To keep track of all the files owned by a user
    struct User {
        address addr;
        bytes32[] documentList;
        mapping(bytes32 => File) documentDetails;
    }

    //Maintain user usage count to implement throttlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }
    
    // List of state variables
    address[] public allowedContractsKeys;
    address[] public userArr;
    mapping(address => bool) allowedContracts;
    mapping( address => User )  users;
    mapping( address => bool )  admins;
    mapping( bytes32 => File )  files;
    bool public stopped = false;
    
    //Events for logging
    event LogFallback(address _senderaddr,uint _value);
  
    // modified to restric access to allowed users and contracts
    modifier onlyAllowedContractOrOwner {
        require (allowedContracts[msg.sender] != true && msg.sender != owner,"Should be a owner");
        _;
    }

    /** @dev addAllowedContractOrOwner. function to add allowed contracts or owners to the list.
        * The list of users have the privilege to execute methods that make changes to the state of this ProveDatabase.
        * @param _addr address of contract or user.
        * @return status true/false.
        */
    function addAllowedContractOrOwner(address _addr)
    public
    onlyOwner 
    returns(bool) {
        if( allowedContracts[_addr] == false ) {
            allowedContracts[_addr] = true;
            allowedContractsKeys.push(_addr);
            return true;
        }
        return false;
    }

    /** @dev isAllowedContractOrOwner. This function determines of an address is allowed to  make change to the state of ProveDatabase contract.
        * The list of users have the previliges to execute methods that make changes to the state of this ProveDatabase.
        * @param _addr address of contract or user.
        * @return status true/false.
        */
    function isAllowedContractOrOwner(address _addr)
    public
    view 
    returns(bool) {
        return allowedContracts[_addr];
    }
    
    /** @dev addFile. This function adds a document to the data store. 
        * files are maintained for each user. An array inside user struct contains all the document the user uploaded so far.
        * document struct contains the document details
        * @param caller documentId.
        * @param _docHash documentId.
        * @param _userName name of the owner.
        * @param _ipfsHash hash of the document returned by IPFS.
        * @param _docTags additional tags.
        * @return status true/false.
        */
    function addFile(address caller, bytes32 _docHash, bytes32 _userName, bytes memory _ipfsHash, bytes memory _docTags) public returns(bool) {
        if(users[caller].documentDetails[_docHash].docHash == 0x0 ){
            userArr.push(caller);
            users[caller].addr = msg.sender;
            users[caller].documentList.push(_docHash);
            users[caller].documentDetails[_docHash] = File(_docHash, _userName,block.timestamp,_ipfsHash,_docTags);
            return true;
        }
        return false;
    }
    
    /** @dev Returns details of a single document. Goes through all the users addresses to look up a particular document using docHash .
        * @param caller user address.
        * @param _docHash unique documentId.
        * @return docHash unique documentId.
        * @return userName onwer name.
        * @return docTimestamp document registered timestamp.
        * @return ipfsHash hash of the document returned by IPFS.
        * @return docTags additional tags describing the document uploaded.
        */
    function getFile(address caller,bytes32 _docHash) 
    public 
    view 
    returns(bytes32, bytes32, uint, bytes memory, bytes memory){
        require(_docHash != 0x0, "File Hash is mandatory");
        File storage document = users[caller].documentDetails[_docHash];
        for (uint i = 0; i < userArr.length; i++){  // Go through all the users to see if file exists.
            if (users[userArr[i]].documentDetails[_docHash].docHash != 0x0 ) {
                document = users[userArr[i]].documentDetails[_docHash];
                break;
            } 
        }
        return(document.docHash,document.userName,document.docTimestamp,document.ipfsHash,document.docTags);
    }
    
    /** @dev retrieveAllFiles. Returns all the files that belong to the sender. 
        * @return documentList list of document addresses.
        */
    function retrieveAllFiles(address caller) 
    public 
    view 
    returns(bytes32[] memory){
        return users[caller].documentList;
    }
    
    /** @dev checkBalance. Checks the ether balance of the contract account. 
        * @return balance contract ether balance.
        */
    function checkBalance() public view returns(uint){
        return address(this).balance;
    }
    
    /** @dev withdrawFunds. Allows the owner to withdraw ether balance the contract account. 
        * pull over push for external calls.
        * @return status true/false.
        */
    function withdrawFunds() public onlyOwner returns(bool){
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
        return true;
    }

    // Fallback method to prevet calls to with data and unknown functions to the contract.
    // This function is invoked when a call is made to the contrat with no matching function signature. 
    function () external payable {
        require(msg.data.length == 0,"Message Length is not zero");
        emit LogFallback(msg.sender,msg.value);
    }

}   
