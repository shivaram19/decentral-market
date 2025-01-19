// src/components/product/ProductForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '@/context/Web3Context';
import toast from 'react-hot-toast';
import { create } from 'ipfs-http-client';

const auth = 'Basic ' + Buffer.from(
  import.meta.env.VITE_IPFS_PROJECT_ID + ':' +
  import.meta.env.VITE_IPFS_PROJECT_SECRET
).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default function ProductForm() {
  const navigate = useNavigate();
  const { signer, account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'digital',
    image: null
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      description: '',
      price: '',
      image: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
      isValid = false;
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image (JPEG, PNG, or GIF)'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToIPFS = async (file) => {
    const buffer = await file.arrayBuffer();
    try {
      const added = await client.add(buffer);
      return added.path;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload image to IPFS');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Creating your product...', { id: 'create-product' });

      // Upload image to IPFS
      const ipfsHash = await uploadToIPFS(formData.image);

      // Create product metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        image: `ipfs://${ipfsHash}`,
        timestamp: Date.now()
      };

      // Upload metadata to IPFS
      const metadataHash = await client.add(JSON.stringify(metadata));

      // Get contract instance
      const contract = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_ADDRESS,
        ['function listProduct(string memory, uint256) public returns (uint256)'],
        signer
      );

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(formData.price);

      // List product
      const tx = await contract.listProduct(metadataHash.path, priceInWei);
      await tx.wait();

      toast.success('Product created successfully!', { id: 'create-product' });
      navigate('/marketplace');
    } catch (error) {
      console.error('Create product error:', error);
      toast.error('Failed to create product. Please try again.', { id: 'create-product' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
          Product Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Enter product name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Describe your product (minimum 20 characters)"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="digital">Digital Product</option>
          <option value="art">Digital Art</option>
          <option value="service">Service</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
          Price (ETH) *
        </label>
        <input
          id="price"
          type="number"
          step="0.0001"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="0.0"
        />
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {previewUrl ? (
              <div className="mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
              </div>
            ) : (
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}