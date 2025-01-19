import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { formatAddress } from '@/utils/format';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`https://ipfs.io/ipfs/${product.ipfsHash}`}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary-600 font-medium">
            {ethers.utils.formatEther(product.price)} ETH
          </span>
          <span className="text-sm text-gray-500">
            By {formatAddress(product.seller)}
          </span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="mt-4 block text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}