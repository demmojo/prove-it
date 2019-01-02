pragma solidity ^0.4.24;

import "./Mortal.sol";

/** @title Register. 
    * This contract handles maintaining the current version of Prove contract
    */
contract Register is Mortal {
    
    address backendContract;
    address[] public previousBackends;
    
    // event to log the current version of the contract
    event LogCurrentVersion(address _address);
    
    // Modifier to restrict access.
    // Only owner will be able to change the current version of the contract
    modifier onlyOwner() {
        require(msg.sender == owner,"Sender is not owner");
        _;
    }
    
    /** @dev Constructor. 
    * Constructor accepts the intial versioin of the contract address 
    */
    constructor(address initAddr) public {
        backendContract = initAddr;
        owner = msg.sender;
    }
    
    /** @dev changeContractVersion changes the current version of the contract address
        * @param _newBackend new address of the contract.
        * @return true/false.
        */
    function changeContractVersion(address _newBackend) public
    onlyOwner()
    returns (bool)
    {
        if(_newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = _newBackend;
            return true;
        }
        emit LogCurrentVersion(backendContract);
        return false;
    }
    
    /** @dev getCurrentVersion returns the current version of the smart contract
    * @return current version of the contract.
    */
    function getCurrentVersion() public view returns(address){
        return backendContract;
    }
    
}