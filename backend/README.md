# SafeBite Backend

## Overview

Basic backend setup for SafeBite API server. This is a skeleton structure that will be implemented later.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure `.env` with:
   - RPC_URL: Ethereum RPC endpoint
   - Contract addresses (after deployment)
   - PORT: Server port (default: 3000)

4. Run server:
```bash
npm run dev  # Development mode
# or
npm start    # Production mode
```

## Structure

- `server.js` - Main server file
- `package.json` - Dependencies
- `.env.example` - Environment variable template

## TODO

- Implement API routes
- Add controllers for business logic
- Add service layer for smart contract interactions
- Add error handling and validation

