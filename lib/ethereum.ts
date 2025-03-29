import { ethers } from 'ethers';

// ABI for a simple verification contract
const VERIFICATION_CONTRACT_ABI = [
  "function verifyDocument(string memory documentHash, string memory documentURI) public returns (uint256)",
  "function getVerification(uint256 verificationId) public view returns (address verifier, string memory documentHash, string memory documentURI, uint256 timestamp)",
  "function verificationExists(string memory documentHash) public view returns (bool)"
];

// Initialize Ethereum provider
export const getProvider = () => {
  const network = process.env.ETHEREUM_NETWORK || 'mainnet';
  const providerUrl = process.env.ETHEREUM_PROVIDER_URL || '';
  
  if (!providerUrl) {
    throw new Error('Ethereum provider URL not configured');
  }
  
  return new ethers.providers.JsonRpcProvider(providerUrl, network);
};

// Initialize contract instance
export const getVerificationContract = () => {
  const provider = getProvider();
  const contractAddress = process.env.VERIFICATION_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error('Verification contract address not configured');
  }
  
  return new ethers.Contract(contractAddress, VERIFICATION_CONTRACT_ABI, provider);
};

// Get wallet with private key
export const getWallet = () => {
  const privateKey = process.env.ETHEREUM_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('Ethereum private key not configured');
  }
  
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
};

// Verify a document on the blockchain
export const verifyDocument = async (documentHash: string, documentURI: string) => {
  try {
    const wallet = getWallet();
    const contract = getVerificationContract().connect(wallet);
    
    const tx = await contract.verifyDocument(documentHash, documentURI);
    const receipt = await tx.wait();
    
    // Extract verification ID from event logs
    const event = receipt.events?.find((e: ethers.Event) => e.event === 'DocumentVerified');
    const verificationId = event?.args?.verificationId.toString();
    
    return {
      transactionHash: receipt.transactionHash,
      verificationId,
      blockNumber: receipt.blockNumber,
      timestamp: Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error verifying document on blockchain:', error);
    throw error;
  }
};

// Check if a document is already verified
export const isDocumentVerified = async (documentHash: string) => {
  try {
    const contract = getVerificationContract();
    return await contract.verificationExists(documentHash);
  } catch (error) {
    console.error('Error checking document verification:', error);
    return false;
  }
};

// Get verification details
export const getVerificationDetails = async (verificationId: string) => {
  try {
    const contract = getVerificationContract();
    const details = await contract.getVerification(verificationId);
    
    return {
      verifier: details.verifier,
      documentHash: details.documentHash,
      documentURI: details.documentURI,
      timestamp: details.timestamp.toNumber()
    };
  } catch (error) {
    console.error('Error getting verification details:', error);
    throw error;
  }
};

// Create a hash of a document
export const createDocumentHash = (document: any) => {
  return ethers.utils.id(JSON.stringify(document));
};

// Verify a portfolio
export const verifyPortfolio = async (portfolioData: any, ipfsHash: string) => {
  const documentHash = createDocumentHash(portfolioData);
  const documentURI = `ipfs://${ipfsHash}`;
  
  return await verifyDocument(documentHash, documentURI);
};

// Verify a resume
export const verifyResume = async (resumeData: any, ipfsHash: string) => {
  const documentHash = createDocumentHash(resumeData);
  const documentURI = `ipfs://${ipfsHash}`;
  
  return await verifyDocument(documentHash, documentURI);
};

// Get transaction URL for block explorer
export const getTransactionUrl = (transactionHash: string) => {
  const network = process.env.ETHEREUM_NETWORK || 'mainnet';
  
  if (network === 'mainnet') {
    return `https://etherscan.io/tx/${transactionHash}`;
  } else if (network === 'goerli') {
    return `https://goerli.etherscan.io/tx/${transactionHash}`;
  } else if (network === 'sepolia') {
    return `https://sepolia.etherscan.io/tx/${transactionHash}`;
  } else if (network === 'polygon') {
    return `https://polygonscan.com/tx/${transactionHash}`;
  } else if (network === 'mumbai') {
    return `https://mumbai.polygonscan.com/tx/${transactionHash}`;
  }
  
  return `https://etherscan.io/tx/${transactionHash}`;
};
