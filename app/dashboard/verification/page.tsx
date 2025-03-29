"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield, ExternalLink, CheckCircle2, AlertCircle, FileCheck, Link2 } from "lucide-react";
import { getIPFSRecords, getVerifications } from "@/lib/supabase";
import { getTransactionUrl, isDocumentVerified, getVerificationDetails } from "@/lib/ethereum";
import { verifyIPFSHash } from "@/lib/pinata";
import { WalletConnect } from "@/components/wallet-connect";

export default function VerificationPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [ipfsRecords, setIpfsRecords] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("verifications");
  const [verifying, setVerifying] = useState(false);
  const [verificationHash, setVerificationHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { toast } = useToast();

  // Load user's verifications and IPFS records
  useEffect(() => {
    const loadData = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const [userVerifications, userIpfsRecords] = await Promise.all([
            getVerifications(user.id),
            getIPFSRecords(user.id)
          ]);
          
          setVerifications(userVerifications);
          setIpfsRecords(userIpfsRecords);
        } catch (error) {
          console.error("Error loading verification data:", error);
          toast({
            title: "Error",
            description: "Failed to load verification data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [isLoaded, isSignedIn, user, toast]);

  const handleVerifyTransaction = async () => {
    if (!verificationHash) {
      toast({
        title: "Input Required",
        description: "Please enter a transaction hash to verify.",
        variant: "destructive",
      });
      return;
    }
    
    setVerificationStatus("loading");
    
    try {
      // Get verification details from blockchain
      const details = await getVerificationDetails(verificationHash);
      
      // Check if IPFS hash is valid
      const isIPFSValid = await verifyIPFSHash(details.documentHash);
      
      setVerificationResult({
        ...details,
        isIPFSValid,
        transactionUrl: getTransactionUrl(verificationHash)
      });
      
      setVerificationStatus("success");
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification Failed",
        description: "Could not verify the provided transaction hash. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Web3 Verification</h1>
          <p className="text-muted-foreground mt-1">
            Verify your credentials on the blockchain and manage your IPFS records
          </p>
        </div>
        <WalletConnect className="w-full md:w-auto" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="ipfs">IPFS Records</TabsTrigger>
          <TabsTrigger value="verify">Verify Transaction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verifications" className="space-y-4">
          {verifications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Verifications Found</CardTitle>
                <CardDescription>
                  You haven't verified any documents on the blockchain yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verify your portfolios and resumes to add them to the blockchain for immutable proof of authenticity.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifications.map((verification) => (
                <Card key={verification.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-green-500" />
                      {verification.reference_type === 'portfolio' ? 'Portfolio Verification' : 'Resume Verification'}
                    </CardTitle>
                    <CardDescription>
                      Verified on {new Date(verification.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Blockchain:</span>
                        <span>{verification.blockchain}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="flex items-center">
                          <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                          {verification.status}
                        </span>
                      </div>
                      {verification.ipfs_hash && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">IPFS Hash:</span>
                          <span className="font-mono text-xs truncate max-w-[200px]">{verification.ipfs_hash}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <a 
                        href={getTransactionUrl(verification.transaction_hash)} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Blockchain
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ipfs" className="space-y-4">
          {ipfsRecords.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No IPFS Records Found</CardTitle>
                <CardDescription>
                  You haven't stored any documents on IPFS yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When you create portfolios and resumes, they will be stored on IPFS for decentralized access.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ipfsRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {record.file_name || record.content_type}
                    </CardTitle>
                    <CardDescription>
                      Stored on {new Date(record.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{record.content_type}</span>
                      </div>
                      {record.file_size && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Size:</span>
                          <span>{(record.file_size / 1024).toFixed(2)} KB</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IPFS Hash:</span>
                        <span className="font-mono text-xs truncate max-w-[200px]">{record.ipfs_hash}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <a 
                        href={`https://gateway.pinata.cloud/ipfs/${record.ipfs_hash}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on IPFS
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="verify">
          <Card>
            <CardHeader>
              <CardTitle>Verify Blockchain Transaction</CardTitle>
              <CardDescription>
                Enter a transaction hash to verify its authenticity and view the associated document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash</Label>
                <div className="flex space-x-2">
                  <Input
                    id="txHash"
                    placeholder="0x..."
                    value={verificationHash}
                    onChange={(e) => setVerificationHash(e.target.value)}
                  />
                  <Button 
                    onClick={handleVerifyTransaction}
                    disabled={verificationStatus === "loading" || !verificationHash}
                  >
                    {verificationStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify
                  </Button>
                </div>
              </div>
              
              {verificationStatus === "success" && verificationResult && (
                <div className="bg-muted p-6 rounded-md">
                  <div className="flex items-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold">Verification Successful</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Verifier:</span>
                      <span className="col-span-2 font-mono truncate">{verificationResult.verifier}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Document Hash:</span>
                      <span className="col-span-2 font-mono truncate">{verificationResult.documentHash}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Document URI:</span>
                      <span className="col-span-2 font-mono truncate">{verificationResult.documentURI}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="col-span-2">
                        {new Date(verificationResult.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground">IPFS Status:</span>
                      <span className="col-span-2 flex items-center">
                        {verificationResult.isIPFSValid ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            Available on IPFS
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                            Not found on IPFS
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" asChild className="w-full">
                        <a 
                          href={verificationResult.transactionUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Transaction
                        </a>
                      </Button>
                    </div>
                    
                    {verificationResult.isIPFSValid && verificationResult.documentURI.startsWith('ipfs://') && (
                      <div>
                        <Button variant="outline" asChild className="w-full">
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${verificationResult.documentURI.replace('ipfs://', '')}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileCheck className="mr-2 h-4 w-4" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {verificationStatus === "error" && (
                <div className="bg-destructive/10 p-6 rounded-md">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="h-6 w-6 text-destructive mr-2" />
                    <h3 className="text-lg font-semibold">Verification Failed</h3>
                  </div>
                  <p className="text-sm">
                    The transaction hash could not be verified. Please check that you entered a valid verification transaction hash.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
