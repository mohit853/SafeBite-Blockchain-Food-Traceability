/**
 * API Service
 * Handles all backend API calls
 * 
 * TODO: Implement API calls
 * - Create axios instance with base URL
 * - Implement all API endpoints
 * - Handle errors
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Product API calls
 */
export const productAPI = {
  /**
   * Register a new product
   * POST /api/products/register
   * 
   * TODO:
   * 1. Make POST request with product data
   * 2. Return response data
   */
  register: async (data) => {
    // TODO: Implement
    return await api.post('/api/products/register', data);
  },

  /**
   * Get product by ID
   * GET /api/products/:id
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return product data
   */
  getById: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/products/${productId}`);
  },

  /**
   * Get product journey
   * GET /api/products/:id/journey
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return journey array
   */
  getJourney: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/products/${productId}/journey`);
  },

  /**
   * Get product provenance
   * GET /api/products/:id/provenance
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return provenance data
   */
  getProvenance: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/products/${productId}/provenance`);
  },

  /**
   * List products
   * GET /api/products
   * 
   * TODO:
   * 1. Make GET request with optional query params
   * 2. Return products array
   */
  list: async (params = {}) => {
    // TODO: Implement
    return await api.get('/api/products', { params });
  }
};

/**
 * Transfer API calls
 */
export const transferAPI = {
  /**
   * Transfer ownership
   * POST /api/transfers
   * 
   * TODO:
   * 1. Make POST request
   * 2. Return transaction hash
   */
  transfer: async (data) => {
    // TODO: Implement
    return await api.post('/api/transfers', data);
  },

  /**
   * Batch transfer
   * POST /api/transfers/batch
   * 
   * TODO:
   * 1. Make POST request
   * 2. Return transaction hash
   */
  batchTransfer: async (data) => {
    // TODO: Implement
    return await api.post('/api/transfers/batch', data);
  },

  /**
   * Get transfer history
   * GET /api/transfers/:productId
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return transfer history
   */
  getHistory: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/transfers/${productId}`);
  }
};

/**
 * Verification API calls
 */
export const verificationAPI = {
  /**
   * Verify authenticity
   * POST /api/verification/authenticity
   * 
   * TODO:
   * 1. Make POST request
   * 2. Return verification result
   */
  verifyAuthenticity: async (data) => {
    // TODO: Implement
    return await api.post('/api/verification/authenticity', data);
  },

  /**
   * Perform quality check
   * POST /api/verification/quality
   * 
   * TODO:
   * 1. Make POST request
   * 2. Return transaction hash
   */
  performQualityCheck: async (data) => {
    // TODO: Implement
    return await api.post('/api/verification/quality', data);
  },

  /**
   * Check compliance
   * POST /api/verification/compliance
   * 
   * TODO:
   * 1. Make POST request
   * 2. Return transaction hash
   */
  checkCompliance: async (data) => {
    // TODO: Implement
    return await api.post('/api/verification/compliance', data);
  },

  /**
   * Get verification history
   * GET /api/verification/:productId
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return verification history
   */
  getHistory: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/verification/${productId}`);
  }
};

/**
 * Role API calls
 */
export const roleAPI = {
  /**
   * Check role
   * GET /api/roles/check/:address
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return role information
   */
  check: async (address) => {
    // TODO: Implement
    return await api.get(`/api/roles/check/${address}`);
  },

  /**
   * Get my role
   * GET /api/roles/my-role?address=0x...
   * 
   * TODO:
   * 1. Make GET request with address query param
   * 2. Return role
   */
  getMyRole: async (address) => {
    // TODO: Implement
    return await api.get('/api/roles/my-role', { params: { address } });
  }
};

/**
 * QR Code API calls
 */
export const qrAPI = {
  /**
   * Get QR code image
   * GET /api/qr/:productId
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return image URL or blob
   */
  getImage: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/qr/${productId}`, { responseType: 'blob' });
  },

  /**
   * Get QR code data
   * GET /api/qr/:productId/data
   * 
   * TODO:
   * 1. Make GET request
   * 2. Return QR data object
   */
  getData: async (productId) => {
    // TODO: Implement
    return await api.get(`/api/qr/${productId}/data`);
  }
};

export default api;

