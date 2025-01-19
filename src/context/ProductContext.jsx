import React, { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '@/config/contracts';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { signer } = useWeb3();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContract = () => {
    if (!signer) throw new Error('No signer available');
    return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
  };

  const listProduct = async (data) => {
    try {
      setIsLoading(true);
      const contract = getContract();
      const tx = await contract.listProduct(data.ipfsHash, ethers.utils.parseEther(data.price));
      await tx.wait();
      toast.success('Product listed successfully!');
      return true;
    } catch (error) {
      console.error('List product error:', error);
      toast.error('Failed to list product');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const contract = getContract();
      const totalProducts = await contract.totalProducts();
      const productsData = await Promise.all(
        Array.from({ length: totalProducts.toNumber() }, (_, i) =>
          contract.products(i + 1)
        )
      );
      setProducts(productsData);
      return productsData;
    } catch (error) {
      console.error('Get products error:', error);
      toast.error('Failed to fetch products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      listProduct,
      getProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);