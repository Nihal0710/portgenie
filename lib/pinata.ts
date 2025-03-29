import axios from 'axios';

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

// Function to upload JSON data to IPFS via Pinata
export const uploadJSONToIPFS = async (jsonData: any): Promise<PinataResponse | null> => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  
  try {
    const response = await axios.post(
      url,
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': process.env.PINATA_API_KEY || '',
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY || ''
        }
      }
    );
    
    return response.data as PinataResponse;
  } catch (error) {
    console.error("Error uploading to IPFS via Pinata:", error);
    return null;
  }
};

// Function to upload a file to IPFS via Pinata
export const uploadFileToIPFS = async (file: File): Promise<PinataResponse | null> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      uploadedBy: 'PortGenie',
      timestamp: new Date().toISOString()
    }
  });
  formData.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);
  
  try {
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': process.env.PINATA_API_KEY || '',
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY || ''
        }
      }
    );
    
    return response.data as PinataResponse;
  } catch (error) {
    console.error("Error uploading file to IPFS via Pinata:", error);
    return null;
  }
};

// Function to retrieve data from IPFS via Pinata gateway
export const getFromIPFS = async (ipfsHash: string): Promise<any> => {
  try {
    const gateway = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    const response = await axios.get(`${gateway}${ipfsHash}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving from IPFS:", error);
    return null;
  }
};

// Function to verify if a hash exists on IPFS
export const verifyIPFSHash = async (ipfsHash: string): Promise<boolean> => {
  try {
    const gateway = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    const response = await axios.head(`${gateway}${ipfsHash}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error verifying IPFS hash:", error);
    return false;
  }
};
