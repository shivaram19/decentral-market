
// src/pages/Marketplace.jsx
import React, { useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import ProductGrid from '@/components/product/ProductGrid';

export default function Marketplace() {
  const { products, getProducts, isLoading } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      {isLoading ? (
        <div className="text-center">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600">
          No products available yet
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}