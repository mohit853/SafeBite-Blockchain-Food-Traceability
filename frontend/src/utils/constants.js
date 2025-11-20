/**
 * Constants
 * Application-wide constants
 */

// Role enum values (must match contract)
export const ROLES = {
  PRODUCER: 0,
  DISTRIBUTOR: 1,
  RETAILER: 2,
  REGULATOR: 3,
  CONSUMER: 4
};

// Role names
export const ROLE_NAMES = {
  [ROLES.PRODUCER]: 'Producer',
  [ROLES.DISTRIBUTOR]: 'Distributor',
  [ROLES.RETAILER]: 'Retailer',
  [ROLES.REGULATOR]: 'Regulator',
  [ROLES.CONSUMER]: 'Consumer'
};

// Product status enum values
export const PRODUCT_STATUS = {
  CREATED: 0,
  SHIPPED: 1,
  RECEIVED: 2,
  STORED: 3,
  DELIVERED: 4
};

// Product status names
export const STATUS_NAMES = {
  [PRODUCT_STATUS.CREATED]: 'Created',
  [PRODUCT_STATUS.SHIPPED]: 'Shipped',
  [PRODUCT_STATUS.RECEIVED]: 'Received',
  [PRODUCT_STATUS.STORED]: 'Stored',
  [PRODUCT_STATUS.DELIVERED]: 'Delivered'
};

// Network configuration
export const NETWORK_CONFIG = {
  localhost: {
    chainId: 1337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545'
  }
};

