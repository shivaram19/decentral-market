import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/utils/format';

export default function UserTransactions() {
  const { account, signer } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const escrowContract = new ethers.Contract(
          import.meta.env.VITE_ESCROW_ADDRESS,
          ['function getTransactionsByUser(address) public view returns (bytes32[])'],
          signer
        );

        const txIds = await escrowContract.getTransactionsByUser(account);
        const txDetails = await Promise.all(
          txIds.map(id => escrowContract.transactions(id))
        );

        setTransactions(
          txDetails.map((tx, index) => ({
            id: txIds[index],
            buyer: tx[0],
            seller: tx[1],
            amount: ethers.utils.formatEther(tx[2]),
            isReleased: tx[3],
            isRefunded: tx[4],
            deadline: tx[5].toNumber()
          }))
        );
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (account && signer) {
      loadTransactions();
    }
  }, [account, signer]);

  if (isLoading) return <div>Loading transactions...</div>;
  if (transactions.length === 0) return <div>No transactions found</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              With
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {tx.buyer === account ? 'Purchase' : 'Sale'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatAddress(tx.buyer === account ? tx.seller : tx.buyer)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {tx.amount} ETH
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.isReleased ? 'bg-green-100 text-green-800' :
                    tx.isRefunded ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {tx.isReleased ? 'Completed' :
                    tx.isRefunded ? 'Refunded' :
                      'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}