import Web3Verification from '@/components/web3/web3-verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck } from 'lucide-react';

export default function SpecificHashVerification() {
  const ipfsHash = 'bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym';
  const mockContractAddress = '0x1234567890123456789012345678901234567890';
  const mockTokenId = '1';
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-primary" />
              Portfolio Certificate Verification
            </CardTitle>
            <CardDescription>
              Verify the authenticity and ownership of this portfolio certificate stored on IPFS and blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
              <div className="w-full lg:w-1/2">
                <h2 className="text-lg font-semibold mb-2">About This Certificate</h2>
                
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
              </div>
              
              <div className="w-full lg:w-1/2 bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">IPFS Hash</h2>
                <p className="font-mono text-sm break-all bg-background p-2 rounded mb-2">
                  {ipfsHash}
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
          ipfsHash={ipfsHash}
          contractAddress={mockContractAddress}
          tokenId={mockTokenId}
          entityType="portfolio"
          entityId="portfolio-123"
        />
      </div>
    </div>
  );
} 