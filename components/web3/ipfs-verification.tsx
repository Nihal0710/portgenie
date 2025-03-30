"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy, FileCheck, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface IPFSVerificationProps {
  ipfsHash: string;
  entityType?: string;
  entityId?: string;
}

export default function IPFSVerification({ ipfsHash, entityType, entityId }: IPFSVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [pinataMetadata, setPinataMetadata] = useState<any>(null);
  const [ipfsContent, setIpfsContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  const verifyIPFSHash = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`/api/ipfs/verify?hash=${ipfsHash}`);
      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        setPinataMetadata(data.metadata || null);
        setIpfsContent(data.content || null);
        toast.success('IPFS content verified successfully');
      } else {
        setIsVerified(false);
        setError(data.message || 'Could not verify IPFS hash');
        toast.error('Failed to verify IPFS content');
      }
    } catch (err) {
      console.error('Error verifying IPFS hash:', err);
      setIsVerified(false);
      setError('An error occurred while verifying the IPFS hash');
      toast.error('Error during verification process');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Auto-verify when component mounts
  useEffect(() => {
    if (ipfsHash) {
      verifyIPFSHash();
    }
  }, [ipfsHash]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          IPFS Verification
        </CardTitle>
        <CardDescription>
          Verify content integrity using IPFS distributed storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IPFS Hash</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(ipfsHash)}
                  className="h-6 px-2"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="truncate text-sm font-mono bg-muted p-2 rounded-md">
                {ipfsHash}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gateway URL</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  className="h-6 px-2"
                >
                  <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
              <p className="truncate text-sm font-mono bg-muted p-2 rounded-md">
                {gatewayUrl}
              </p>
            </div>

            <div className="mb-4">
              <span className="text-sm font-medium">Verification Status</span>
              <div className="mt-1 flex items-center">
                {isVerified === null ? (
                  <Badge variant="outline" className="gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                    Pending
                  </Badge>
                ) : isVerified ? (
                  <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 border-red-200 bg-red-50 text-red-800">
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {pinataMetadata && (
              <div className="mb-4">
                <span className="text-sm font-medium">Metadata</span>
                <div className="mt-1 p-2 bg-muted rounded-md">
                  <div className="text-xs space-y-1">
                    {pinataMetadata.name && (
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{pinataMetadata.name}</span>
                      </div>
                    )}
                    {pinataMetadata.keyvalues && pinataMetadata.keyvalues.createdAt && (
                      <div className="flex justify-between">
                        <span className="font-medium">Created:</span>
                        <span>{new Date(pinataMetadata.keyvalues.createdAt).toLocaleString()}</span>
                      </div>
                    )}
                    {pinataMetadata.keyvalues && pinataMetadata.keyvalues.description && (
                      <div className="flex justify-between">
                        <span className="font-medium">Description:</span>
                        <span>{pinataMetadata.keyvalues.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {ipfsContent && (
              <div className="mb-4">
                <span className="text-sm font-medium">Content Preview</span>
                <div className="mt-1 p-2 bg-muted rounded-md max-h-40 overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {typeof ipfsContent === 'object' 
                      ? JSON.stringify(ipfsContent, null, 2) 
                      : ipfsContent.substring(0, 500) + (ipfsContent.length > 500 ? '...' : '')}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={verifyIPFSHash} 
          disabled={isVerifying}
          className="gap-2"
        >
          <FileCheck className="h-4 w-4" />
          {isVerifying ? 'Verifying...' : 'Verify Again'}
        </Button>

        <Button 
          variant="default" 
          asChild
          className="gap-2"
        >
          <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View on IPFS
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 