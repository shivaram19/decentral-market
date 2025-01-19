import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { useProducts } from '@/context/ProductContext';
import ProductGrid from '@/components/product/ProductGrid';

export default function Profile() {
  const { account } = useWeb3();
  const { products, getProducts } = useProducts();
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const loadUserProducts = async () => {
      await getProducts();
      setUserProducts(products.filter(p => p.seller === account));
    };

    if (account) {
      loadUserProducts();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="text-center">
        Please connect your wallet to view your profile
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">My Products</h2>
        {userProducts.length === 0 ? (
          <div className="text-center text-gray-600">
            You haven't listed any products yet
          </div>
        ) : (
          <ProductGrid products={userProducts} />
        )}
      </div>
    </div>
  );
}