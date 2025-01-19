import React from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/utils/format';

export default function ProductDetails({ product, onPurchase }) {
  const { account } = useWeb3();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6">
          <img
            src={`https://ipfs.io/ipfs/${product.ipfsHash}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price</span>
              <span className="text-xl font-bold text-primary-600">
                {ethers.utils.formatEther(product.price)} ETH
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Seller</span>
              <a href={`https://etherscan.io/address/${product.seller}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                {formatAddress(product.seller)}
              </a>
            </div>

            {account && account !== product.seller && (
              <button
                onClick={onPurchase}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                Purchase Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}