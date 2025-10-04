// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CredentialLedger {
    address public issuer;
    
    struct Credential {
        bytes32 certHash;
        address learnerAddress;
        uint256 issuedAt;
    }
    
    mapping(uint256 => Credential) public credentials;
    mapping(bytes32 => bool) public hashExists;
    
    event CredentialIssued(uint256 indexed certId, address indexed learnerAddress, bytes32 certHash);
    
    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer can call this function");
        _;
    }
    
    constructor() {
        issuer = msg.sender;
    }
    
    function issueCredential(uint256 _certId, address _learnerAddress, bytes32 _certHash) external onlyIssuer {
        require(credentials[_certId].certHash == 0, "Credential ID already exists");
        require(!hashExists[_certHash], "Hash already exists");
        
        credentials[_certId] = Credential({
            certHash: _certHash,
            learnerAddress: _learnerAddress,
            issuedAt: block.timestamp
        });
        
        hashExists[_certHash] = true;
        
        emit CredentialIssued(_certId, _learnerAddress, _certHash);
    }
    
    function getCredentialHash(uint256 _certId) external view returns (bytes32) {
        return credentials[_certId].certHash;
    }
    
    function isCredentialValid(bytes32 _certHash) external view returns (bool) {
        return hashExists[_certHash];
    }
    
    function getCredentialInfo(uint256 _certId) external view returns (bytes32, address, uint256) {
        Credential memory cred = credentials[_certId];
        return (cred.certHash, cred.learnerAddress, cred.issuedAt);
    }
}