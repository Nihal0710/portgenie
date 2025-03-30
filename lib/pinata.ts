import axios from 'axios';
import FormData from 'form-data';
import { saveIpfsFile } from './supabase';

const PINATA_API_URL = 'https://api.pinata.cloud';

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

// Function to pin a file to IPFS via Pinata
export async function pinFileToIPFS(
  file: File,
  userId: string,
  options: {
    name?: string;
    description?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    tags?: string[];
  } = {}
) {
  try {
    // Get API keys - in a real app, these would be stored securely
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not found');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    // Prepare metadata
    const metadata = {
      name: options.name || file.name,
      keyvalues: {
        description: options.description || '',
        userId: userId,
        relatedEntityType: options.relatedEntityType || '',
        relatedEntityId: options.relatedEntityId || '',
        tags: options.tags || [],
        createdAt: new Date().toISOString(),
      },
    };

    formData.append('pinataMetadata', JSON.stringify(metadata));

    // Pin options
    const pinataOptions = {
      cidVersion: 1,
      wrapWithDirectory: false,
    };

    formData.append('pinataOptions', JSON.stringify(pinataOptions));

    // Upload to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error pinning file to IPFS: ${response.statusText}`);
    }

    const { IpfsHash, PinSize, Timestamp } = response.data;

    // Save IPFS record to Supabase
    const ipfsRecord = await saveIpfsFile(userId, {
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      ipfs_hash: IpfsHash,
      ipfs_url: `ipfs://${IpfsHash}`,
      pinata_id: IpfsHash,
      related_entity_type: options.relatedEntityType || '',
      related_entity_id: options.relatedEntityId || '',
      metadata: {
        description: options.description || '',
        tags: options.tags || [],
        pinSize: PinSize,
        timestamp: Timestamp,
      },
    });

    return {
      success: true,
      ipfsHash: IpfsHash,
      ipfsUrl: `ipfs://${IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
      record: ipfsRecord,
    };
  } catch (error) {
    console.error('Error in pinFileToIPFS:', error);
    throw error;
  }
}

// Function to pin JSON metadata to IPFS
export async function pinJSONToIPFS(
  jsonData: any,
  userId: string,
  options: {
    name?: string;
    description?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    tags?: string[];
  } = {}
) {
  try {
    // Get API keys
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not found');
    }

    // Prepare metadata
    const metadata = {
      name: options.name || 'JSON Data',
      keyvalues: {
        description: options.description || '',
        userId: userId,
        relatedEntityType: options.relatedEntityType || '',
        relatedEntityId: options.relatedEntityId || '',
        tags: options.tags || [],
        createdAt: new Date().toISOString(),
      },
    };

    // Pin options
    const pinataOptions = {
      cidVersion: 1,
    };

    // Upload JSON to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      {
        pinataMetadata: metadata,
        pinataContent: jsonData,
        pinataOptions: pinataOptions,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error pinning JSON to IPFS: ${response.statusText}`);
    }

    const { IpfsHash, PinSize, Timestamp } = response.data;

    // Create a file-like size (JSON string length in bytes)
    const jsonString = JSON.stringify(jsonData);
    const fileSize = new Blob([jsonString]).size;

    // Save IPFS record to Supabase
    const ipfsRecord = await saveIpfsFile(userId, {
      file_name: options.name || 'metadata.json',
      file_type: 'application/json',
      file_size: fileSize,
      ipfs_hash: IpfsHash,
      ipfs_url: `ipfs://${IpfsHash}`,
      pinata_id: IpfsHash,
      related_entity_type: options.relatedEntityType || '',
      related_entity_id: options.relatedEntityId || '',
      metadata: {
        description: options.description || '',
        tags: options.tags || [],
        pinSize: PinSize,
        timestamp: Timestamp,
        jsonData: jsonData, // Store the actual JSON data
      },
    });

    return {
      success: true,
      ipfsHash: IpfsHash,
      ipfsUrl: `ipfs://${IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
      record: ipfsRecord,
    };
  } catch (error) {
    console.error('Error in pinJSONToIPFS:', error);
    throw error;
  }
}

// Function to unpin content from IPFS
export async function unpinFromIPFS(
  ipfsHash: string,
  userId: string
) {
  try {
    // Get API keys
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not found');
    }

    // Unpin from Pinata
    const response = await axios.delete(
      `${PINATA_API_URL}/pinning/unpin/${ipfsHash}`,
      {
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error unpinning from IPFS: ${response.statusText}`);
    }

    return {
      success: true,
      message: `Successfully unpinned ${ipfsHash}`,
    };
  } catch (error) {
    console.error('Error in unpinFromIPFS:', error);
    throw error;
  }
}

// Function to get pinned content list
export async function getPinnedContent() {
  try {
    // Get API keys
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not found');
    }

    const response = await axios.get(
      `${PINATA_API_URL}/data/pinList?status=pinned`,
      {
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error getting pinned content: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error in getPinnedContent:', error);
    throw error;
  }
}

// Function to check if Pinata credentials are valid
export async function testPinataConnection() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      return { success: false, message: 'Pinata API credentials not found' };
    }

    const response = await axios.get(`${PINATA_API_URL}/data/testAuthentication`, {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    });

    return {
      success: true,
      message: 'Pinata connection successful',
      data: response.data,
    };
  } catch (error) {
    console.error('Error testing Pinata connection:', error);
    return { 
      success: false, 
      message: 'Failed to connect to Pinata', 
      error 
    };
  }
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
