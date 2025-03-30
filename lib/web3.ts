import { ethers } from 'ethers';
import { createWeb3Credential } from './supabase';
import { pinJSONToIPFS } from './pinata';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

// Sample NFT certificate ABI (simplified)
const certificateABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
];

// Connect to Web3 provider
export async function connectToWeb3Provider() {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum provider not found. Please install MetaMask or another wallet');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
      provider,
      signer,
      address,
      network,
    };
  } catch (error) {
    console.error('Error connecting to Web3 provider:', error);
    throw error;
  }
}

// Get connected wallet
export async function getConnectedWallet() {
  try {
    const { address, network } = await connectToWeb3Provider();
    
    return {
      address,
      network: network.name,
      chainId: network.chainId.toString(),
    };
  } catch (error) {
    console.error('Error getting connected wallet:', error);
    throw error;
  }
}

// Mint a certificate as NFT
export async function mintCertificateNFT(
  userId: string,
  certificateId: string,
  certificateData: any,
  contractAddress: string
) {
  try {
    // Connect to provider and signer
    const { signer, address } = await connectToWeb3Provider();

    // First, upload the certificate metadata to IPFS
    const metadataIpfsResult = await pinJSONToIPFS(
      {
        name: certificateData.title,
        description: certificateData.description,
        image: certificateData.thumbnail_url,
        attributes: [
          {
            trait_type: 'Issuer',
            value: certificateData.issuer,
          },
          {
            trait_type: 'Issue Date',
            value: certificateData.issue_date,
          },
          {
            display_type: 'date',
            trait_type: 'Issue Date',
            value: new Date(certificateData.issue_date).getTime() / 1000,
          },
          {
            trait_type: 'Credential ID',
            value: certificateData.credential_id,
          },
        ],
        external_url: certificateData.credential_url,
      },
      userId,
      {
        name: `certificate-${certificateId}-metadata.json`,
        description: `Metadata for certificate ${certificateData.title}`,
        relatedEntityType: 'certificate',
        relatedEntityId: certificateId,
        tags: ['certificate', 'nft', 'metadata'],
      }
    );

    // Connect to NFT contract
    const contract = new ethers.Contract(
      contractAddress,
      certificateABI,
      signer
    );

    // Mint the NFT
    const tx = await contract.mint(
      address,
      metadataIpfsResult.ipfsUrl
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Extract token ID from logs
    const tokenIdHex = receipt.logs[0].topics[3];
    const tokenId = parseInt(tokenIdHex, 16).toString();

    // Save the Web3 credential to the database
    const web3Credential = await createWeb3Credential(userId, {
      wallet_address: address,
      blockchain: 'ethereum',
      credential_type: 'certificate',
      entity_id: certificateId,
      transaction_hash: receipt.transactionHash,
      contract_address: contractAddress,
      token_id: tokenId,
      metadata_uri: metadataIpfsResult.ipfsUrl,
    });

    return {
      success: true,
      transaction: receipt,
      tokenId: tokenId,
      metadataUri: metadataIpfsResult.ipfsUrl,
      web3Credential: web3Credential,
    };
  } catch (error) {
    console.error('Error minting certificate NFT:', error);
    throw error;
  }
}

// Verify ownership of a certificate NFT
export async function verifyCertificateOwnership(
  contractAddress: string,
  tokenId: string,
  expectedOwner: string
) {
  try {
    // Connect to provider
    const { provider } = await connectToWeb3Provider();

    // Connect to NFT contract
    const contract = new ethers.Contract(
      contractAddress,
      certificateABI,
      provider
    );

    // Get the token owner
    const owner = await contract.ownerOf(tokenId);

    // Compare addresses (case insensitive)
    const isOwner = owner.toLowerCase() === expectedOwner.toLowerCase();

    return {
      success: true,
      isOwner: isOwner,
      owner: owner,
      expectedOwner: expectedOwner,
    };
  } catch (error) {
    console.error('Error verifying certificate ownership:', error);
    throw error;
  }
}

// Get NFT metadata from token URI
export async function getNFTMetadata(
  contractAddress: string,
  tokenId: string
) {
  try {
    // Connect to provider
    const { provider } = await connectToWeb3Provider();

    // Connect to NFT contract
    const contract = new ethers.Contract(
      contractAddress,
      certificateABI,
      provider
    );

    // Get the token URI
    const tokenURI = await contract.tokenURI(tokenId);

    // Fetch metadata from URI
    let metadata;
    if (tokenURI.startsWith('ipfs://')) {
      const ipfsHash = tokenURI.replace('ipfs://', '');
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      metadata = await response.json();
    } else {
      const response = await fetch(tokenURI);
      metadata = await response.json();
    }

    return {
      success: true,
      tokenURI: tokenURI,
      metadata: metadata,
    };
  } catch (error) {
    console.error('Error getting NFT metadata:', error);
    throw error;
  }
}

// Mint resume as NFT
export async function mintResumeNFT(
  userId: string,
  resumeId: string,
  resumeData: any,
  contractAddress: string
) {
  try {
    // Follow similar pattern to mintCertificateNFT
    const { signer, address } = await connectToWeb3Provider();

    // Upload resume metadata to IPFS
    const metadataIpfsResult = await pinJSONToIPFS(
      {
        name: `${resumeData.title} - Resume`,
        description: `Professional resume of ${resumeData.title}`,
        resume_content: resumeData.content,
        attributes: [
          {
            trait_type: 'Template',
            value: resumeData.template,
          },
          {
            trait_type: 'Created Date',
            value: resumeData.created_at,
          },
          {
            display_type: 'date',
            trait_type: 'Created Date',
            value: new Date(resumeData.created_at).getTime() / 1000,
          },
        ],
      },
      userId,
      {
        name: `resume-${resumeId}-metadata.json`,
        description: `Metadata for resume ${resumeData.title}`,
        relatedEntityType: 'resume',
        relatedEntityId: resumeId,
        tags: ['resume', 'nft', 'metadata'],
      }
    );

    // Connect to NFT contract
    const contract = new ethers.Contract(
      contractAddress,
      certificateABI,
      signer
    );

    // Mint the NFT
    const tx = await contract.mint(
      address,
      metadataIpfsResult.ipfsUrl
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Extract token ID from logs
    const tokenIdHex = receipt.logs[0].topics[3];
    const tokenId = parseInt(tokenIdHex, 16).toString();

    // Save the Web3 credential to the database
    const web3Credential = await createWeb3Credential(userId, {
      wallet_address: address,
      blockchain: 'ethereum',
      credential_type: 'resume',
      entity_id: resumeId,
      transaction_hash: receipt.transactionHash,
      contract_address: contractAddress,
      token_id: tokenId,
      metadata_uri: metadataIpfsResult.ipfsUrl,
    });

    return {
      success: true,
      transaction: receipt,
      tokenId: tokenId,
      metadataUri: metadataIpfsResult.ipfsUrl,
      web3Credential: web3Credential,
    };
  } catch (error) {
    console.error('Error minting resume NFT:', error);
    throw error;
  }
}

// Mint portfolio as NFT
export async function mintPortfolioNFT(
  userId: string,
  portfolioId: string,
  portfolioData: any,
  contractAddress: string
) {
  try {
    // Follow similar pattern to mintCertificateNFT
    const { signer, address } = await connectToWeb3Provider();

    // Upload portfolio metadata to IPFS
    const metadataIpfsResult = await pinJSONToIPFS(
      {
        name: portfolioData.title,
        description: portfolioData.description,
        portfolio_url: `https://portgenie.com/portfolio/${portfolioData.slug}`,
        theme: portfolioData.theme,
        color_scheme: portfolioData.color_scheme,
        attributes: [
          {
            trait_type: 'Theme',
            value: portfolioData.theme,
          },
          {
            trait_type: 'Color Scheme',
            value: portfolioData.color_scheme,
          },
          {
            trait_type: 'Created Date',
            value: portfolioData.created_at,
          },
          {
            display_type: 'date',
            trait_type: 'Created Date',
            value: new Date(portfolioData.created_at).getTime() / 1000,
          },
        ],
      },
      userId,
      {
        name: `portfolio-${portfolioId}-metadata.json`,
        description: `Metadata for portfolio ${portfolioData.title}`,
        relatedEntityType: 'portfolio',
        relatedEntityId: portfolioId,
        tags: ['portfolio', 'nft', 'metadata'],
      }
    );

    // Connect to NFT contract
    const contract = new ethers.Contract(
      contractAddress,
      certificateABI,
      signer
    );

    // Mint the NFT
    const tx = await contract.mint(
      address,
      metadataIpfsResult.ipfsUrl
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Extract token ID from logs
    const tokenIdHex = receipt.logs[0].topics[3];
    const tokenId = parseInt(tokenIdHex, 16).toString();

    // Save the Web3 credential to the database
    const web3Credential = await createWeb3Credential(userId, {
      wallet_address: address,
      blockchain: 'ethereum',
      credential_type: 'portfolio',
      entity_id: portfolioId,
      transaction_hash: receipt.transactionHash,
      contract_address: contractAddress,
      token_id: tokenId,
      metadata_uri: metadataIpfsResult.ipfsUrl,
    });

    return {
      success: true,
      transaction: receipt,
      tokenId: tokenId,
      metadataUri: metadataIpfsResult.ipfsUrl,
      web3Credential: web3Credential,
    };
  } catch (error) {
    console.error('Error minting portfolio NFT:', error);
    throw error;
  }
} 