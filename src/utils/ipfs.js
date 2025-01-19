import axios from 'axios';

const IPFS_API_KEY = import.meta.env.VITE_IPFS_API_KEY;
const IPFS_API_URL = 'https://mainnet.infura.io/v3/8e5434269c60436eab6358e3a8c48579';

export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(IPFS_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${IPFS_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const ipfsHash = response.data.value.cid;
    return {
      hash: ipfsHash,
      url: `https://ipfs.io/ipfs/${ipfsHash}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

// Helper function to fetch from IPFS
export const getIPFSContent = async (hash) => {
  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw new Error('Failed to fetch from IPFS');
  }
};

// Get IPFS URL with different gateways
export const getIPFSUrl = (hash, gateway = 'ipfs.io') => {
  const gateways = {
    'ipfs.io': `https://ipfs.io/ipfs/${hash}`,
    'dweb': `https://dweb.link/ipfs/${hash}`,
    'cloudflare': `https://cloudflare-ipfs.com/ipfs/${hash}`,
  };
  
  return gateways[gateway] || gateways['ipfs.io'];
};