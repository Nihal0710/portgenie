import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserWeb3Credentials, getUserIpfsFiles } from '@/lib/supabase';
import VerificationClient from './verification-client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Web3 Verification - PortGenie',
    description: 'Manage your blockchain-verified content and credentials',
  };
}

async function getServerSideData() {
  // For demo purposes, we'll use mock data
  // In a real implementation, get the actual user ID from the auth session
  const userId = 'user123';
  
  try {
    // Fetch user's Web3 credentials
    const credentials = await getUserWeb3Credentials(userId);
    
    // Fetch user's IPFS files
    const ipfsFiles = await getUserIpfsFiles(userId);
    
    return {
      credentials: credentials || [],
      ipfsFiles: ipfsFiles || [],
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      credentials: [],
      ipfsFiles: [],
    };
  }
}

export default async function VerificationPage() {
  const { credentials, ipfsFiles } = await getServerSideData();

  // Add a special demo credential for display purposes
  const demoCredentials = [
    {
      id: 'demo-1',
      credential_type: 'portfolio',
      blockchain: 'ethereum',
      contract_address: '0x1234567890123456789012345678901234567890',
      token_id: '1',
      wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
      verification_status: 'verified',
      is_verified: true,
      created_at: new Date().toISOString(),
      entity_id: 'portfolio-123',
      transaction_hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      metadata_uri: 'ipfs://bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym',
    }
  ];
  
  // Add demo IPFS file
  const demoIpfsFiles = [
    {
      id: 'demo-ipfs-1',
      file_name: 'portfolio-certificate.json',
      file_type: 'application/json',
      file_size: 1024,
      ipfs_hash: 'bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym',
      ipfs_url: 'ipfs://bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym',
      pinata_id: 'demo-pin-id',
      related_entity_type: 'portfolio',
      related_entity_id: 'portfolio-123',
      created_at: new Date().toISOString(),
      pinned_at: new Date().toISOString(),
    }
  ];
  
  // Combine real and demo data
  const allCredentials = [...demoCredentials, ...credentials];
  const allIpfsFiles = [...demoIpfsFiles, ...ipfsFiles];
  
  return <VerificationClient credentials={allCredentials} ipfsFiles={allIpfsFiles} />;
}
