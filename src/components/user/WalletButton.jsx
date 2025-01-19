import React from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/utils/format';

export default function WalletButton() {
  const { account, connectWallet } = useWeb3();

  return account ? (
    <button
      className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors"
    >
      {formatAddress(account)}
    </button>
  ) : (
    <button
      onClick={connectWallet}
      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
    >
      Connect Wallet
    </button>
  );
}