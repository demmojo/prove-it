pragma solidity ^0.4.22;


/** @title Owned contract 
    * assigns an owner of the contract at the time of deployment. 
    */
contract Owned {
    
    address public owner;

    /** @dev Modifier to verify that the sender is owner.*/
    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner of the contract");
        _;
    }
   
    constructor() public {
        owner = msg.sender;
    }

    /** @dev Change the owner of the contract.*/
    function changeOwner(address _newOwner) public onlyOwner 
    {
        require(_newOwner != 0x0,"Address cannot be 0x0");
        owner = _newOwner;
    }

}


/** @title The Mortal contract extends the Owner contract. */
contract Mortal is Owned {
    
    /** @dev Destroy the contract.
        * Any remaining balance in the smart contract is transferred to the owner account. 
        */
    function kill() public onlyOwner{
        require(msg.sender == owner,"You are not the owner of the contract");
        selfdestruct(owner);
    }
    
}