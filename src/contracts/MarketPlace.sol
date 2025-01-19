// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Marketplace is Ownable, Pausable {
    IERC20 public loyaltyToken;
    address public escrowContract;
    uint256 private _productIds;
    uint256 public platformFee = 25; // 2.5%
    
    struct Product {
        uint256 id;
        address seller;
        string ipfsHash;
        uint256 price;
        bool isActive;
        uint256 totalSales;
        uint256 totalRatings;
        uint256 ratingSum;
    }
    
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public userProducts;
    mapping(uint256 => mapping(address => bool)) public hasUserRated;
    
    event ProductListed(uint256 indexed productId, address indexed seller, uint256 price);
    event ProductUpdated(uint256 indexed productId, uint256 price, bool isActive);
    event ProductRated(uint256 indexed productId, address indexed buyer, uint256 rating);
    
    constructor(address _loyaltyToken, address _escrowContract) Ownable(msg.sender) {
        loyaltyToken = IERC20(_loyaltyToken);
        escrowContract = _escrowContract;
    }
    
    function listProduct(string memory _ipfsHash, uint256 _price) external whenNotPaused returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        
        _productIds++;
        products[_productIds] = Product({
            id: _productIds,
            seller: msg.sender,
            ipfsHash: _ipfsHash,
            price: _price,
            isActive: true,
            totalSales: 0,
            totalRatings: 0,
            ratingSum: 0
        });
        
        userProducts[msg.sender].push(_productIds);
        emit ProductListed(_productIds, msg.sender, _price);
        return _productIds;
    }

    function updateProduct(uint256 _productId, uint256 _newPrice, bool _isActive) external whenNotPaused {
        require(products[_productId].seller == msg.sender, "Not the seller");
        require(_newPrice > 0, "Invalid price");
        
        products[_productId].price = _newPrice;
        products[_productId].isActive = _isActive;
        
        emit ProductUpdated(_productId, _newPrice, _isActive);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}