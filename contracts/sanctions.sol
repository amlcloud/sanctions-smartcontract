// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SanctionsContract is Ownable {

    mapping(string=>string) public sanctionsData;
    string[] public sanctionsHashes;
    address public changingOwner;

    constructor(address _changingOwner) Ownable() {
        changingOwner = _changingOwner;
    }

    function addSanctions (string memory _sanctions, string memory _sanctionsHash) public {
        require(msg.sender == changingOwner, "Ownable: You are not the owner, Bye.");
        sanctionsData[_sanctionsHash] = _sanctions;
        sanctionsHashes.push(_sanctionsHash);
    }

    function getSanctions(string memory _sanctionsHash) public view returns (string memory) {
        return sanctionsData[_sanctionsHash];
    }

    function getAllSanctions() public view returns (string[] memory) {
        return sanctionsHashes;
    }
}