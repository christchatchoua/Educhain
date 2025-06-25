// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EduChain {
    struct Credential {
        address issuer;
        address holder;
        string degreeTitle;
        string institutionName;
        uint256 issueDate;
        string credentialId; // unique hash or ID
    }

    mapping(string => Credential) private credentials; // credentialId => Credential
    mapping(address => string[]) private holderToCredentials; // holder => credentialIds
    mapping(address => bool) public isIssuer; // role management
    address public owner;
    uint256 public credentialCount;

    event CredentialIssued(address indexed issuer, address indexed holder, string credentialId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Not an authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        isIssuer[msg.sender] = true; // deployer is an issuer by default
    }

    function addIssuer(address _issuer) external onlyOwner {
        isIssuer[_issuer] = true;
    }

    function removeIssuer(address _issuer) external onlyOwner {
        isIssuer[_issuer] = false;
    }

    function issueCredential(
        address _holder,
        string memory _degreeTitle,
        string memory _institutionName,
        uint256 _issueDate,
        string memory _credentialId
    ) external onlyIssuer {
        require(credentials[_credentialId].issuer == address(0), "Credential ID already exists");
        credentials[_credentialId] = Credential({
            issuer: msg.sender,
            holder: _holder,
            degreeTitle: _degreeTitle,
            institutionName: _institutionName,
            issueDate: _issueDate,
            credentialId: _credentialId
        });
        holderToCredentials[_holder].push(_credentialId);
        credentialCount++;
        emit CredentialIssued(msg.sender, _holder, _credentialId);
    }

    function getMyCredentials() external view returns (Credential[] memory) {
        string[] memory ids = holderToCredentials[msg.sender];
        Credential[] memory creds = new Credential[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            creds[i] = credentials[ids[i]];
        }
        return creds;
    }

    function verifyCredential(string memory _credentialId) external view returns (
        address issuer,
        address holder,
        string memory degreeTitle,
        string memory institutionName,
        uint256 issueDate
    ) {
        Credential memory cred = credentials[_credentialId];
        require(cred.issuer != address(0), "Credential not found");
        return (
            cred.issuer,
            cred.holder,
            cred.degreeTitle,
            cred.institutionName,
            cred.issueDate
        );
    }

    function getCredentialCount() external view returns (uint256) {
        return credentialCount;
    }
} 