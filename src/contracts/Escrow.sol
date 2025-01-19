// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow is Ownable, Pausable {
    struct EscrowTransaction {
        address buyer;
        address seller;
        uint256 amount;
        bool isReleased;
        bool isRefunded;
        uint256 deadline;
    }
    
    mapping(bytes32 => EscrowTransaction) public transactions;
    mapping(address => uint256) public pendingWithdrawals;
    
    uint256 public escrowPeriod = 7 days;
    address public marketplaceContract;
    
    event EscrowCreated(bytes32 indexed transactionId, address indexed buyer, address indexed seller, uint256 amount);
    event EscrowReleased(bytes32 indexed transactionId);
    event EscrowRefunded(bytes32 indexed transactionId);
    event WithdrawalProcessed(address indexed recipient, uint256 amount);
    
    constructor(address _marketplaceContract) Ownable(msg.sender) {
        marketplaceContract = _marketplaceContract;
    }
    
    function createEscrow(address _seller) external payable whenNotPaused returns (bytes32) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_seller != address(0), "Invalid seller address");
        
        bytes32 transactionId = keccak256(
            abi.encodePacked(msg.sender, _seller, msg.value, block.timestamp)
        );
        
        transactions[transactionId] = EscrowTransaction({
            buyer: msg.sender,
            seller: _seller,
            amount: msg.value,
            isReleased: false,
            isRefunded: false,
            deadline: block.timestamp + escrowPeriod
        });
        
        emit EscrowCreated(transactionId, msg.sender, _seller, msg.value);
        return transactionId;
    }
    
    function withdraw() external whenNotPaused {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawal");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalProcessed(msg.sender, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}