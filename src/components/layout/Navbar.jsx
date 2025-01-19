import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/utils/format';

export default function Navbar() {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            DMarket
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/marketplace" className="text-gray-600 hover:text-gray-800">
              Marketplace
            </Link>
            <Link to="/create-product" className="text-gray-600 hover:text-gray-800">
              Sell
            </Link>
            {account ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  {formatAddress(account)}
                </Link>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}