import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Web3Verification from '@/components/web3/web3-verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface VerifyPageProps {
  params: {
    hash: string;
  };
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  return {
    title: `Verify IPFS Content - ${params.hash}`,
    description: 'Verify the authenticity and ownership of content stored on IPFS',
  };
}

async function getHashInfo(hash: string) {
  try {
    const { data, error } = await supabase
      .from('ipfs_files')
      .select('*, web3_credentials(*)')
      .eq('ipfs_hash', hash)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching IPFS record:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getHashInfo:', error);
    return null;
  }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { hash } = params;
  
  // Validate hash format (IPFS hashes start with 'Qm' or 'bafy')
  if (!/^(Qm[1-9A-Za-z]{44}|bafy[a-zA-Z0-9]{55})$/.test(hash)) {
    notFound();
  }

  // Look up additional information for this hash from our database
  const hashInfo = await getHashInfo(hash);
  
  // For demo purposes, handle the specific hash
  const isSpecificHash = hash === 'bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym';
  const mockContractAddress = '0x1234567890123456789012345678901234567890';
  const mockTokenId = '1';

  // Get contract address and token ID from our database if available
  const contractAddress = hashInfo?.web3_credentials?.contract_address || 
    (isSpecificHash ? mockContractAddress : undefined);
    
  const tokenId = hashInfo?.web3_credentials?.token_id || 
    (isSpecificHash ? mockTokenId : undefined);
    
  const entityType = (hashInfo?.related_entity_type || 'portfolio') as 'portfolio' | 'resume' | 'certificate';
  const entityId = hashInfo?.related_entity_id;
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-primary" />
              IPFS Content Verification
            </CardTitle>
            <CardDescription>
              Verify the authenticity and ownership of content stored on IPFS and blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
              <div className="w-full lg:w-1/2">
                <h2 className="text-lg font-semibold mb-2">About This Content</h2>
                
                {isSpecificHash ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This IPFS hash represents a verified portfolio certificate stored on the blockchain. It contains metadata about the portfolio and its ownership information.
                    </p>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Portfolio Details</h3>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>Created by: <span className="font-medium">John Doe</span></li>
                        <li>Creation Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></li>
                        <li>Blockchain: <span className="font-medium">Ethereum</span></li>
                        <li>Token Standard: <span className="font-medium">ERC-721</span></li>
                      </ul>
                    </div>
                  </div>
                ) : hashInfo ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This IPFS hash represents a {hashInfo.related_entity_type || 'file'} stored on the decentralized IPFS network. You can verify its authenticity and ownership below.
                    </p>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">File Details</h3>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        <li>File Name: <span className="font-medium">{hashInfo.file_name}</span></li>
                        <li>File Type: <span className="font-medium">{hashInfo.file_type}</span></li>
                        <li>File Size: <span className="font-medium">{hashInfo.file_size} bytes</span></li>
                        <li>Uploaded: <span className="font-medium">{new Date(hashInfo.created_at).toLocaleString()}</span></li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This IPFS hash represents content stored on the decentralized IPFS network. You can verify its authenticity using the tools below.
                    </p>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Gateway Access</h3>
                      <p className="text-sm mb-2">
                        View this content directly on IPFS via a public gateway:
                      </p>
                      <Button variant="outline" asChild className="gap-2">
                        <a 
                          href={`https://gateway.pinata.cloud/ipfs/${hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Content
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-full lg:w-1/2 bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">IPFS Hash</h2>
                <p className="font-mono text-sm break-all bg-background p-2 rounded mb-2">
                  {hash}
                </p>
                <p className="text-xs text-muted-foreground">
                  This is a Content Identifier (CID) that uniquely references content on the 
                  InterPlanetary File System (IPFS) network. IPFS is a distributed system for storing 
                  and accessing files, websites, applications, and data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Web3Verification 
          ipfsHash={hash}
          contractAddress={contractAddress}
          tokenId={tokenId}
          entityType={entityType}
          entityId={entityId}
        />
      </div>
    </div>
  );
} 