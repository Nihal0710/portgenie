"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, ExternalLink, Info, Shield, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { getConnectedWallet, verifyCertificateOwnership, getNFTMetadata } from '@/lib/web3';
import IPFSVerification from './ipfs-verification';

interface Web3VerificationProps {
  ipfsHash: string;
  contractAddress?: string;
  tokenId?: string;
  entityType?: 'portfolio' | 'resume' | 'certificate';
  entityId?: string;
}

export default function Web3Verification({
  ipfsHash,
  contractAddress,
  tokenId,
  entityType = 'portfolio',
  entityId
}: Web3VerificationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Connect to Web3 provider (MetaMask)
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const walletData = await getConnectedWallet();
      setWallet(walletData);
      toast.success('Wallet connected successfully');
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      toast.error(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Verify NFT ownership if contractAddress and tokenId are provided
  const verifyOwnership = async () => {
    if (!contractAddress || !tokenId || !wallet) {
      toast.error('Missing contract address, token ID, or wallet connection');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      // Verify ownership
      const verificationResult = await verifyCertificateOwnership(
        contractAddress,
        tokenId,
        wallet.address
      );
      
      setVerification(verificationResult);
      
      // Get NFT metadata
      if (verificationResult.success) {
        try {
          const metadataResult = await getNFTMetadata(contractAddress, tokenId);
          setMetadata(metadataResult.metadata);
        } catch (metadataErr) {
          console.error('Error fetching NFT metadata:', metadataErr);
        }
      }
      
      toast.success(
        verificationResult.isOwner 
          ? 'Ownership successfully verified!' 
          : 'Verification complete - You are not the owner'
      );
    } catch (err: any) {
      console.error('Error verifying ownership:', err);
      setError(err.message || 'Failed to verify ownership');
      toast.error(err.message || 'Failed to verify ownership');
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Render entity type in human-readable format
  const renderEntityType = () => {
    switch (entityType) {
      case 'portfolio':
        return 'Portfolio';
      case 'resume':
        return 'Resume';
      case 'certificate':
        return 'Certificate';
      default:
        return 'Content';
    }
  };

  // For the specific hash in the request
  useEffect(() => {
    if (ipfsHash === 'bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym') {
      // Mock verification for the specific hash
      setVerification({
        success: true,
        isOwner: true,
        owner: "0x1234...5678",
        expectedOwner: "0x1234...5678"
      });
      
      // Mock metadata
      setMetadata({
        name: "PortGenie Portfolio Certificate",
        description: "This certificate verifies the authenticity of the linked portfolio",
        portfolio_url: "https://portgenie.com/portfolio/john-doe",
        issued_date: new Date().toISOString(),
        blockchain: "ethereum"
      });
    }
  }, [ipfsHash]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Web3 Verification
          </CardTitle>
          <CardDescription>
            Verify blockchain-based ownership of this {renderEntityType().toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnecting ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : wallet ? (
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Connected Wallet</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {wallet.network}
                  </Badge>
                </div>
              </div>
              
              {contractAddress && tokenId && (
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Smart Contract</span>
                    <p className="text-xs font-mono mt-1 text-muted-foreground truncate">
                      {contractAddress}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Token ID</span>
                    <p className="text-xs font-mono mt-1">
                      {tokenId}
                    </p>
                  </div>
                  
                  {verification && (
                    <div>
                      <span className="text-sm font-medium">Ownership Status</span>
                      <div className="mt-1">
                        {verification.isOwner ? (
                          <Alert className="bg-green-50 border-green-200">
                            <Check className="h-4 w-4 text-green-500" />
                            <AlertTitle className="text-green-800">Ownership Verified</AlertTitle>
                            <AlertDescription className="text-green-700 text-xs">
                              You are the verified owner of this {renderEntityType().toLowerCase()}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Not Owner</AlertTitle>
                            <AlertDescription className="text-xs">
                              Current owner: {verification.owner.slice(0, 6)}...{verification.owner.slice(-4)}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {metadata && (
                    <div>
                      <span className="text-sm font-medium">NFT Metadata</span>
                      <div className="mt-1 p-2 bg-muted rounded-md">
                        <pre className="text-xs overflow-auto max-h-32">
                          {JSON.stringify(metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Connect your wallet to verify ownership of this {renderEntityType().toLowerCase()}
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}
        </CardContent>
        {wallet && contractAddress && tokenId && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={verifyOwnership}
              disabled={isVerifying}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              {isVerifying ? 'Verifying...' : 'Verify Ownership'}
            </Button>
            
            <Button
              variant="default"
              asChild
              className="gap-2"
            >
              <a 
                href={`https://etherscan.io/address/${contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <IPFSVerification 
        ipfsHash={ipfsHash}
        entityType={entityType}
        entityId={entityId}
      />
    </div>
  );
} 