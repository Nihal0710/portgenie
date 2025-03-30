# Web3 Verification System

This document outlines the Web3 verification system implemented in PortGenie, which allows users to verify the authenticity and ownership of their portfolios, resumes, and certificates using IPFS and blockchain technology.

## Overview

The Web3 verification system combines two powerful technologies:

1. **IPFS (InterPlanetary File System)** - A distributed system for storing and accessing files, websites, applications, and data
2. **Blockchain (Ethereum)** - A decentralized ledger that provides immutable proof of ownership through NFTs (Non-Fungible Tokens)

This combination creates a tamper-proof verification system that allows anyone to:
- Verify the content has not been modified (through IPFS content addressing)
- Confirm ownership of the content (through blockchain verification)
- Access the content even if the original platform is unavailable (through IPFS distribution)

## Features

### IPFS Verification

- **Content Integrity**: IPFS uses content addressing, meaning files are identified by their content rather than location. Any change to the content will result in a different hash.
- **Permanent Storage**: Content pinned to IPFS via Pinata remains accessible as long as it's pinned.
- **Metadata Storage**: Additional information about the content is stored alongside the file.

### Blockchain Verification

- **Ownership Proof**: NFTs on the Ethereum blockchain provide cryptographic proof of ownership.
- **Transfer History**: All transfers of ownership are permanently recorded on the blockchain.
- **Smart Contract Integration**: Custom smart contracts handle the minting and verification of NFTs.

## How It Works

### Storage Process

1. When a user chooses to verify their portfolio, resume, or certificate:
   - The content is converted to a format suitable for storage
   - The content is uploaded to IPFS via Pinata
   - A record is created in the `ipfs_files` table with the resulting IPFS hash
   
2. An NFT is minted on the Ethereum blockchain:
   - The smart contract creates a new token
   - The token's metadata URI points to the IPFS hash
   - The token is assigned to the user's wallet
   - A record is created in the `web3_credentials` table

### Verification Process

1. Users access the verification page with the IPFS hash: `/verify/[hash]`
2. The system checks:
   - If the content exists on IPFS (content integrity)
   - If an associated NFT exists on the blockchain
   - Who currently owns the NFT (ownership verification)
3. Users can connect their wallet to prove they are the owner of the content

## Implementation Details

### Database Schema

Two primary tables support the verification system:

1. `ipfs_files` - Stores information about content uploaded to IPFS:
   - `ipfs_hash` - The content identifier on IPFS
   - `ipfs_url` - The IPFS URI (ipfs://[hash])
   - `file_name`, `file_type`, `file_size` - Basic file metadata
   - `related_entity_type`, `related_entity_id` - Links to the portfolio, resume, or certificate
   - `metadata` - Additional JSON metadata about the content

2. `web3_credentials` - Stores information about blockchain verification:
   - `wallet_address` - The user's Ethereum wallet address
   - `contract_address` - The smart contract address
   - `token_id` - The ID of the NFT token
   - `blockchain` - The blockchain used (e.g., "ethereum")
   - `credential_type` - The type of content being verified (e.g., "portfolio")
   - `entity_id` - Reference to the verified entity
   - `metadata_uri` - The URI to the token's metadata (IPFS URL)

### Components

1. `IPFSVerification` - Verifies content integrity through IPFS:
   - Checks if content exists on IPFS
   - Displays content metadata
   - Shows preview of content
   
2. `Web3Verification` - Verifies ownership through blockchain:
   - Connects to user's wallet
   - Verifies token ownership
   - Displays NFT metadata

3. Verification Page (`/verify/[hash]`) - Combines both verifications:
   - Shows content details
   - Provides IPFS verification
   - Enables blockchain ownership verification

### API Endpoints

1. `/api/ipfs/verify` - Verifies if content exists on IPFS:
   - Checks if hash exists in database
   - Verifies content on Pinata
   - Returns content metadata

## Special Test Case

For testing purposes, a special IPFS hash has been configured:

```
bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym
```

This hash will always return a successful verification without requiring real blockchain interaction.

## Usage Examples

### Verifying a Portfolio

1. Create a portfolio in PortGenie
2. Use the "Verify on Blockchain" option
3. Connect your wallet when prompted
4. Pay gas fees to mint the NFT
5. Share the verification link with others: `/verify/[ipfs_hash]`

### Checking Ownership

1. Visit a verification link
2. Click "Connect Wallet"
3. The system will verify if your wallet address matches the NFT owner
4. If matched, you'll see "Ownership Verified"

## Security Considerations

- Wallet private keys are never stored or transmitted through PortGenie
- Content on IPFS is public - do not include sensitive information
- Smart contract interactions require wallet approval for security

## Future Enhancements

- Support for additional blockchains (Polygon, Solana)
- Integration with decentralized identity systems
- Enhanced privacy options for sensitive documents
- Batch verification for multiple credentials
- Time-bound verification challenges 