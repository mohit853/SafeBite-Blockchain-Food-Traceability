# SafeBite Backend API

## Overview

The backend API server for the SafeBite blockchain food traceability system. This Express.js server provides REST API endpoints that allow the frontend application to interact with the smart contracts deployed on the blockchain. The backend handles contract interactions, data validation, and provides additional services like QR code generation.

## Architecture

The backend follows a layered architecture:

- **Routes**: Define API endpoints and map them to controller functions
- **Controllers**: Handle HTTP requests, validate input, and call services
- **Services**: Contain business logic and smart contract interactions
- **Utils**: Provide helper functions for error handling and data processing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Express, Ethers.js, and QR code generation library.

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and configure:

- `RPC_URL`: Ethereum RPC endpoint (use `http://127.0.0.1:8545` for local Hardhat network)
- `ACCESS_CONTROL_CONTRACT_ADDRESS`: Address of deployed SafeBiteAccessRoles contract
- `SUPPLY_CHAIN_CONTRACT_ADDRESS`: Address of deployed SafeBiteSupplyChain contract
- `PORT`: Server port number (default: 3000)
- `FRONTEND_URL`: Frontend application URL for QR code generation

### 3. Run the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server starts on `http://localhost:3000` by default.

## API Endpoints

### Products

- `POST /api/products/register` - Register a new product
- `GET /api/products/:id` - Get product information
- `GET /api/products/:id/journey` - Get product journey timeline
- `GET /api/products/:id/provenance` - Get complete product provenance
- `GET /api/products` - List products with optional filters

### Transfers

- `POST /api/transfers` - Transfer product ownership
- `POST /api/transfers/batch` - Batch transfer multiple products
- `GET /api/transfers/:productId` - Get transfer history for a product

### Verification

- `POST /api/verification/authenticity` - Verify product authenticity
- `POST /api/verification/quality` - Perform quality check
- `POST /api/verification/compliance` - Perform compliance check
- `GET /api/verification/:productId` - Get verification history

### Roles

- `GET /api/roles/check/:address` - Check role of an address
- `GET /api/roles/my-role` - Get current user's role
- `POST /api/roles/grant` - Grant role to address (admin only)

### QR Codes

- `GET /api/qr/:productId` - Generate QR code image
- `GET /api/qr/:productId/data` - Get QR code data as JSON

### Health Check

- `GET /health` - Server health check endpoint

## Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── productController.js
│   ├── transferController.js
│   ├── verificationController.js
│   └── roleController.js
├── routes/              # API route definitions
│   ├── products.js
│   ├── transfers.js
│   ├── verification.js
│   ├── roles.js
│   └── qr.js
├── services/            # Business logic layer
│   ├── contractService.js    # Smart contract interactions
│   └── qrService.js          # QR code generation
├── utils/               # Utility functions
│   ├── errors.js        # Error handling utilities
│   └── helpers.js       # Helper functions
├── server.js            # Express server entry point
├── package.json         # Dependencies
├── .env.example         # Environment variable template
└── README.md            # This file
```

## Dependencies

- **express**: Web application framework
- **ethers**: Ethereum JavaScript library for contract interactions
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management
- **body-parser**: Request body parsing middleware
- **qrcode**: QR code image generation library
- **nodemon**: Development auto-reload tool (dev dependency)

## Implementation Status

The backend structure is complete with all routes, controllers, and services defined. Each file contains TODO comments with detailed instructions for implementation. The implementation involves:

1. Initializing contract service with provider and contract instances
2. Implementing contract interaction methods in contractService.js
3. Implementing controller functions to handle requests
4. Adding validation and error handling
5. Implementing QR code generation service

## Development Notes

- All contract interactions use Ethers.js v6
- Contract ABIs should be loaded from the artifacts folder
- Contract addresses are loaded from environment variables
- Error handling should parse contract revert messages for user-friendly errors
- All API responses follow a consistent format with success/error indicators
