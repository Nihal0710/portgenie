"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Copy, ExternalLink, Wallet, ChevronDown, LogOut, RefreshCw, Shield } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { updateUserProfile, getUserProfile } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

interface WalletConnectProps {
  className?: string;
  onWalletChange?: (address: string | null) => void;
}

export function WalletConnect({ className, onWalletChange }: WalletConnectProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== 'undefined') {
      const { ethereum } = window as any;
      setIsMetaMaskInstalled(!!ethereum && !!ethereum.isMetaMask);
      
      // Check if already connected
      if (ethereum && ethereum.isMetaMask) {
        ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              if (onWalletChange) {
                onWalletChange(accounts[0]);
              }
              getChainId();
              
              // Save wallet address to user profile if user is logged in
              if (user) {
                saveWalletToProfile(accounts[0]);
              }
            }
          })
          .catch(console.error);
          
        // Listen for account changes
        ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            if (onWalletChange) {
              onWalletChange(accounts[0]);
            }
            
            // Save new wallet address to user profile if user is logged in
            if (user) {
              saveWalletToProfile(accounts[0]);
            }
            
            toast({
              title: "Wallet Changed",
              description: "Your connected wallet address has changed.",
              duration: 3000,
            });
          } else {
            setAccount(null);
            if (onWalletChange) {
              onWalletChange(null);
            }
            
            toast({
              title: "Wallet Disconnected",
              description: "Your wallet has been disconnected.",
              duration: 3000,
            });
          }
        });
        
        // Listen for chain changes
        ethereum.on('chainChanged', (chainId: string) => {
          setChainId(chainId);
          
          // Show notification about network change
          const networkName = getNetworkName(chainId);
          toast({
            title: "Network Changed",
            description: `You are now connected to ${networkName}`,
            duration: 3000,
          });
        });
      }
    }
    
    return () => {
      // Clean up listeners
      if (typeof window !== 'undefined') {
        const { ethereum } = window as any;
        if (ethereum && ethereum.isMetaMask) {
          ethereum.removeAllListeners('accountsChanged');
          ethereum.removeAllListeners('chainChanged');
        }
      }
    };
  }, [user, onWalletChange, toast]);
  
  // Save wallet address to user profile
  const saveWalletToProfile = async (walletAddress: string) => {
    if (!user) return;
    
    try {
      const userProfileData = await getUserProfile(user.id);
      
      // Always update the user's wallet address
      await updateUserProfile(user.id, { 
        wallet_address: walletAddress,
        // Preserve existing profile data
        full_name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      });
      
      toast({
        title: "Wallet Saved",
        description: "Your wallet address has been saved to your profile",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving wallet address to profile:", error);
      toast({
        title: "Profile Update Failed",
        description: "Could not save wallet address to your profile",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const getChainId = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum && ethereum.isMetaMask) {
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
      }
    } catch (error) {
      console.error("Error getting chain ID:", error);
    }
  };

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      const { ethereum } = window as any;
      if (ethereum && ethereum.isMetaMask) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        if (onWalletChange) {
          onWalletChange(accounts[0]);
        }
        getChainId();
        
        // Save wallet address to user profile if user is logged in
        if (user) {
          saveWalletToProfile(accounts[0]);
        }
        
        toast({
          title: "Wallet Connected",
          description: "Your MetaMask wallet has been successfully connected.",
          duration: 3000,
        });
      } else {
        window.open('https://metamask.io/download/', '_blank');
        
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to connect your wallet.",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = async () => {
    setAccount(null);
    if (onWalletChange) {
      onWalletChange(null);
    }
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from this application.",
      duration: 3000,
    });
  };
  
  const switchNetwork = async (targetChainId: string, networkName: string) => {
    if (isSwitchingNetwork) return;
    
    setIsSwitchingNetwork(true);
    
    try {
      const { ethereum } = window as any;
      if (ethereum && ethereum.isMetaMask) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
          
          toast({
            title: "Network Switched",
            description: `Successfully switched to ${networkName}`,
            duration: 3000,
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            // Add the network based on targetChainId
            if (targetChainId === '0x89') {
              // Add Polygon
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x89',
                    chainName: 'Polygon Mainnet',
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18
                    },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/']
                  }
                ],
              });
            } else if (targetChainId === '0x13881') {
              // Add Mumbai Testnet
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x13881',
                    chainName: 'Mumbai Testnet',
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18
                    },
                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                  }
                ],
              });
            }
          } else {
            throw switchError;
          }
        }
      }
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast({
        title: "Network Switch Failed",
        description: error.message || `Failed to switch to ${networkName}`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
        duration: 2000,
      });
    }
  };
  
  const getNetworkName = (id: string | null) => {
    if (!id) return "Unknown Network";
    
    switch (id) {
      case "0x1":
        return "Ethereum Mainnet";
      case "0x89":
        return "Polygon Mainnet";
      case "0x5":
        return "Goerli Testnet";
      case "0xaa36a7":
        return "Sepolia Testnet";
      case "0x13881":
        return "Mumbai Testnet";
      default:
        return "Unknown Network";
    }
  };
  
  const getNetworkColor = () => {
    if (!chainId) return "gray";
    
    switch (chainId) {
      case "0x1":
        return "blue";
      case "0x89":
        return "purple";
      case "0x5":
      case "0xaa36a7":
      case "0x13881":
        return "yellow";
      default:
        return "gray";
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className={className}>
      {!account ? (
        <Button 
          variant="outline" 
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <div className="flex items-center">
                <Image
                  src="/metamask-fox.svg"
                  alt="MetaMask"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <span className="hidden md:inline">{formatAddress(account)}</span>
                <span className="inline md:hidden">{formatAddress(account)}</span>
                <Badge 
                  variant="outline" 
                  className={`ml-2 bg-${getNetworkColor()}-500/10 text-${getNetworkColor()}-500 border-${getNetworkColor()}-500/20 text-xs`}
                >
                  {getNetworkName(chainId).split(' ')[0]}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuItem onClick={copyToClipboard} className="flex justify-between cursor-pointer">
              <span className="truncate">{account}</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Network</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => switchNetwork('0x1', 'Ethereum Mainnet')}
              disabled={chainId === '0x1' || isSwitchingNetwork}
              className="cursor-pointer"
            >
              {chainId === '0x1' ? '✓ ' : ''} Ethereum Mainnet
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => switchNetwork('0x89', 'Polygon Mainnet')}
              disabled={chainId === '0x89' || isSwitchingNetwork}
              className="cursor-pointer"
            >
              {chainId === '0x89' ? '✓ ' : ''} Polygon Mainnet
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => switchNetwork('0x13881', 'Mumbai Testnet')}
              disabled={chainId === '0x13881' || isSwitchingNetwork}
              className="cursor-pointer"
            >
              {chainId === '0x13881' ? '✓ ' : ''} Mumbai Testnet (Polygon)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a 
                href={`https://${chainId === '0x89' ? 'polygonscan.com/address/' : 
                      chainId === '0x13881' ? 'mumbai.polygonscan.com/address/' : 
                      'etherscan.io/address/'}${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="/dashboard/verification"
                className="flex items-center cursor-pointer"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify Documents
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={disconnectWallet}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
