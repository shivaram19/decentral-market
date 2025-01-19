// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyToken is ERC20, Ownable {
    address public marketplaceContract;
    uint256 public rewardRate = 100; // 1% rewards in tokens
    
    mapping(address => uint256) public lastPurchaseBlock;
    mapping(address => uint256) public totalPurchases;
    
    event RewardIssued(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    
    constructor() ERC20("Marketplace Loyalty Token", "MLT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function issueRewards(address _user, uint256 _purchaseAmount) external {
        require(msg.sender == marketplaceContract, "Only marketplace");
        require(_purchaseAmount > 0, "Invalid amount");
        
        uint256 rewardAmount = (_purchaseAmount * rewardRate) / 10000;
        lastPurchaseBlock[_user] = block.number;
        totalPurchases[_user] += _purchaseAmount;
        
        _mint(_user, rewardAmount);
        
        emit RewardIssued(_user, rewardAmount);
    }
}