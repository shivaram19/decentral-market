import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import toast from 'react-hot-toast';

export default function PaymentModal({ product, isOpen, onClose, onSuccess }) {
  const { signer, account } = useWeb3();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading('Processing payment...', { id: 'payment' });

      // Create escrow contract instance
      const escrowContract = new ethers.Contract(
        import.meta.env.VITE_ESCROW_ADDRESS,
        ['function createEscrow(address) public payable returns (bytes32)'],
        signer
      );

      // Create escrow payment
      const tx = await escrowContract.createEscrow(product.seller, {
        value: product.price
      });
      await tx.wait();

      toast.success('Payment successful!', { id: 'payment' });
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.', { id: 'payment' });
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirm Purchase
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You are about to purchase {product.name} for {ethers.utils.formatEther(product.price)} ETH
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}