import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/utils/format';

export default function UserProfile() {
  const { account, signer } = useWeb3();
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const loyaltyContract = new ethers.Contract(
          import.meta.env.VITE_LOYALTY_TOKEN_ADDRESS,
          ['function getUserStats(address) public view returns (uint256, uint256, uint256)'],
          signer
        );

        const stats = await loyaltyContract.getUserStats(account);
        setUserStats({
          lastPurchase: stats[0].toNumber(),
          totalSpent: ethers.utils.formatEther(stats[1]),
          tokenBalance: ethers.utils.formatEther(stats[2])
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (account && signer) {
      loadUserStats();
    }
  }, [account, signer]);

  if (!account) return null;
  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-primary-100 rounded-full p-3">
          <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{formatAddress(account)}</h2>
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            View on Etherscan
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Loyalty Tokens</h3>
          <p className="mt-1 text-lg font-semibold">{userStats.tokenBalance} MLT</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
          <p className="mt-1 text-lg font-semibold">{userStats.totalSpent} ETH</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">Last Purchase</h3>
          <p className="mt-1 text-lg font-semibold">
            {userStats.lastPurchase ? new Date(userStats.lastPurchase * 1000).toLocaleDateString() : 'No purchases yet'}
          </p>
        </div>
      </div>
    </div>
  );
}