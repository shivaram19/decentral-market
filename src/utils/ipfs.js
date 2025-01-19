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

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file);
    return added.path;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};