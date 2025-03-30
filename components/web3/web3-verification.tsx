"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, ExternalLink, Info, Shield, Wallet, RefreshCw } from 'lucide-react';
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
    // Remove mock implementation and replace with real verification
    if (ipfsHash && wallet?.address) {
      // Automatically verify if we have both wallet and ipfsHash
      if (contractAddress && tokenId) {
        verifyOwnership();
      }
    }
  }, [ipfsHash, wallet?.address]);
  
  // Mint NFT if not already minted
  const mintNFT = async () => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      // Call the appropriate mint function based on entityType
      let mintResult;
      
      if (entityType === 'portfolio') {
        const { mintPortfolioNFT } = await import('@/lib/web3');
        mintResult = await mintPortfolioNFT(
          wallet.address, // Use as userId temporarily
          entityId || 'default-portfolio',
          {
            title: 'My Professional Portfolio',
            description: 'Web3 verified professional portfolio showcasing my work and skills',
            thumbnail_url: window.location.origin + '/portfolio-thumbnail.png',
            portfolio_url: window.location.href,
          },
          process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
        );
      } else if (entityType === 'resume') {
        const { mintResumeNFT } = await import('@/lib/web3');
        mintResult = await mintResumeNFT(
          wallet.address, // Use as userId temporarily
          entityId || 'default-resume',
          {
            title: 'My Professional Resume',
            description: 'Web3 verified professional resume',
            content: 'Resume content hash: ' + ipfsHash,
            template: 'Professional',
          },
          process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
        );
      } else {
        const { mintCertificateNFT } = await import('@/lib/web3');
        mintResult = await mintCertificateNFT(
          wallet.address, // Use as userId temporarily
          entityId || 'default-certificate',
          {
            title: 'PortGenie Verification Certificate',
            description: 'This certificate verifies the authenticity of the linked content',
            thumbnail_url: window.location.origin + '/certificate-thumbnail.png',
            issuer: 'PortGenie Platform',
            issue_date: new Date().toISOString(),
            credential_id: ipfsHash,
            credential_url: window.location.href,
          },
          process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
        );
      }
      
      // Set the verification and metadata
      if (mintResult.success) {
        setVerification({
          success: true,
          isOwner: true,
          owner: wallet.address,
          expectedOwner: wallet.address
        });
        
        // Get NFT metadata
        try {
          const metadataResult = await getNFTMetadata(
            mintResult.web3Credential.contract_address,
            mintResult.web3Credential.token_id
          );
          setMetadata(metadataResult.metadata);
        } catch (metadataErr) {
          console.error('Error fetching NFT metadata:', metadataErr);
        }
        
        // Set contractAddress and tokenId from mint result
        // Note: This would normally be saved to the database and retrieved
        toast.success('Successfully minted and verified on blockchain!');
      }
    } catch (err: any) {
      console.error('Error minting NFT:', err);
      setError(err.message || 'Failed to mint NFT');
      toast.error(err.message || 'Failed to mint NFT');
    } finally {
      setIsVerifying(false);
    }
  };
  
  // When a connected wallet has a verification in progress
  const isVerificationInProgress = wallet && !verification && !error;
  
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
              
              {contractAddress && tokenId ? (
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
              ) : isVerificationInProgress ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">IPFS Hash</span>
                    <p className="text-xs font-mono mt-1 text-muted-foreground truncate">
                      {ipfsHash}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Not Yet On Blockchain</AlertTitle>
                      <AlertDescription className="text-xs">
                        This {renderEntityType().toLowerCase()} has been stored on IPFS but not yet minted as an NFT.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      onClick={mintNFT} 
                      className="mt-4 gap-2"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Minting...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          Mint as NFT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
              
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
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Verification
                </>
              )}
            </Button>
            {verification?.isOwner && (
              <a
                href={`https://etherscan.io/token/${contractAddress}?a=${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Blockchain
                </Button>
              </a>
            )}
          </CardFooter>
        )}
      </Card>
      
      <IPFSVerification ipfsHash={ipfsHash} />
    </div>
  );
} 