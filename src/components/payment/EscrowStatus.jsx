import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';

export default function EscrowStatus({ transactionId }) {
  const { signer } = useWeb3();
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const escrowContract = new ethers.Contract(
          import.meta.env.VITE_ESCROW_ADDRESS,
          ['function transactions(bytes32) public view returns (address, address, uint256, bool, bool, uint256)'],
          signer
        );

        const transaction = await escrowContract.transactions(transactionId);
        setStatus({
          isReleased: transaction[3],
          isRefunded: transaction[4],
          deadline: transaction[5].toNumber()
        });
      } catch (error) {
        console.error('Error loading escrow status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId && signer) {
      loadStatus();
    }
  }, [transactionId, signer]);

  if (isLoading) return <div>Loading status...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">Escrow Status</h3>
      <div className="space-y-2">
        <p>
          Status: {
            status?.isReleased ? 'Released' :
              status?.isRefunded ? 'Refunded' :
                'In Escrow'
          }
        </p>
        <p>
          Deadline: {new Date(status?.deadline * 1000).toLocaleString()}
        </p>
      </div>
    </div>
  );
}