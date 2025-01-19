import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to DMarket</h1>
      <p className="text-xl text-gray-600 mb-8">
        A decentralized marketplace for digital products
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/marketplace"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Browse Marketplace
        </Link>
        <Link
          to="/create-product"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          Start Selling
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Secure Transactions</h3>
          <p className="text-gray-600">
            All transactions are secured by smart contracts on the blockchain
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Zero Platform Fees</h3>
          <p className="text-gray-600">
            Trade directly with other users without any intermediary fees
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Reward Points</h3>
          <p className="text-gray-600">
            Earn loyalty tokens for every purchase and sale
          </p>
        </div>
      </div>
    </div>
  );
}
