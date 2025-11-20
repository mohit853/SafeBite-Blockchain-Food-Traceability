# SafeBite Frontend

## Overview

React-based web application for the SafeBite blockchain food traceability system. The frontend provides a user interface for all stakeholders in the supply chain to interact with the blockchain through MetaMask wallet integration. The application includes role-based dashboards, product management, QR code scanning, and verification features.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs React, React Router, Ethers.js, and other required packages.

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and configure:

- `VITE_API_URL`: Backend API URL (default: `http://localhost:3000`)
- `VITE_ACCESS_CONTROL_CONTRACT_ADDRESS`: Address of deployed access control contract
- `VITE_SUPPLY_CHAIN_CONTRACT_ADDRESS`: Address of deployed supply chain contract
- `VITE_RPC_URL`: Ethereum RPC endpoint (default: `http://127.0.0.1:8545`)
- `VITE_CHAIN_ID`: Network chain ID (default: `1337` for local Hardhat)

### 3. Run Development Server

```bash
npm run dev
```

The application starts on `http://localhost:5173` and opens automatically in the browser.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Wallet/       # Wallet connection components
│   │   │   └── ConnectWallet.jsx
│   │   ├── Products/     # Product-related components
│   │   │   └── ProductRegistration.jsx
│   │   ├── Verification/ # Verification components
│   │   │   └── QRScanner.jsx
│   │   └── Common/       # Common components
│   │       └── QRCodeDisplay.jsx
│   ├── pages/            # Page components
│   │   ├── ProducerDashboard.jsx
│   │   ├── DistributorDashboard.jsx
│   │   ├── RetailerDashboard.jsx
│   │   ├── RegulatorDashboard.jsx
│   │   └── ConsumerDashboard.jsx
│   ├── services/         # External service integrations
│   │   ├── web3.js       # MetaMask connection service
│   │   ├── contracts.js  # Smart contract interactions
│   │   └── api.js        # Backend API calls
│   ├── hooks/            # Custom React hooks
│   │   ├── useWeb3.js    # Web3 connection hook
│   │   └── useRole.js    # User role detection hook
│   ├── utils/            # Utility functions
│   │   ├── constants.js  # Application constants
│   │   └── helpers.js    # Helper functions
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## Features

### Role-Based Dashboards

The application provides separate dashboards for each role:

- **Producer Dashboard**: Register products, view registered products, generate QR codes
- **Distributor Dashboard**: View products in transit, transfer to retailers/consumers
- **Retailer Dashboard**: Manage inventory, perform quality checks, transfer to consumers
- **Regulator Dashboard**: View all products, perform compliance checks, audit records
- **Consumer Dashboard**: Scan QR codes, verify products, view product journey and provenance

### Wallet Integration

- MetaMask wallet connection
- Automatic network detection and switching
- Account change handling
- Transaction signing and status tracking

### QR Code Features

- QR code generation for products
- QR code scanning for product verification
- QR code data includes product ID and verification URL

## Dependencies

- **react**: React library for building user interfaces
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **ethers**: Ethereum JavaScript library for blockchain interaction
- **axios**: HTTP client for API requests
- **qrcode.react**: QR code display component
- **html5-qrcode**: QR code scanning library
- **vite**: Build tool and development server

## Implementation Status

The frontend structure is complete with all components, pages, services, and hooks defined. Each file contains TODO comments with detailed implementation instructions. The implementation involves:

1. Implementing Web3 service for MetaMask connection
2. Implementing contract service for smart contract interactions
3. Implementing API service for backend communication
4. Creating React hooks for Web3 and role management
5. Building UI components for each feature
6. Implementing role-based dashboards
7. Adding QR code scanning and generation functionality

## Development Workflow

1. Start with services: Implement `web3.js`, `contracts.js`, and `api.js`
2. Implement hooks: Create `useWeb3` and `useRole` hooks
3. Build components: Start with `ConnectWallet`, then product components
4. Create pages: Implement dashboards one by one
5. Add routing: Set up React Router with role-based navigation
6. Style and polish: Add CSS styling and improve user experience

## Notes

- All contract interactions require MetaMask wallet connection
- Users must have appropriate roles assigned to access role-specific features
- The application connects to local Hardhat network by default (chain ID 1337)
- Contract addresses must match the deployed contracts from `deployments/local.json`
