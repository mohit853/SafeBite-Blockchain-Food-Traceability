/**
 * ProductList Component
 * Displays a list of products with filtering and search
 */

import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import ProductCard from './ProductCard';
import './ProductList.css';

/**
 * ProductList Component
 * 
 * @param {string} ownerAddress - Address to filter products by current owner
 * @param {string} producerAddress - Address to filter products by producer (who registered it)
 * @param {string} currentAccount - Current user's wallet address (for ownership checks)
 * @param {Function} onProductClick - Callback when product is clicked
 * @param {Function} onProductTransfer - Callback when transfer is clicked
 * @param {Function} onQualityCheck - Callback when quality check is clicked (optional)
 * @param {Function} onComplianceCheck - Callback when compliance check is clicked (optional)
 * @param {number} userRole - Current user's role (for showing appropriate buttons)
 * 
 * Fetches and displays a list of products, optionally filtered by owner or producer.
 * Supports search and displays loading/error states.
 * 
 * Note: If producerAddress is provided, shows all products registered by that producer
 * regardless of current ownership. If ownerAddress is provided, shows products
 * currently owned by that address. If neither is provided, shows all products.
 */
export default function ProductList({ ownerAddress, producerAddress, currentAccount, onProductClick, onProductTransfer, onQualityCheck, onComplianceCheck, userRole }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fetch products from API
   * Filters by producer if producerAddress is provided, otherwise by owner if ownerAddress is provided
   */
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {};
        if (producerAddress) {
          params.producer = producerAddress;
        } else if (ownerAddress) {
          params.owner = ownerAddress;
        }
        
        const response = await productAPI.list(params);

        if (response.data.success) {
          setProducts(response.data.products || []);
          setFilteredProducts(response.data.products || []);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [ownerAddress, producerAddress]);

  /**
   * Filter products based on search term
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = products.filter(product => {
      return (
        product.name?.toLowerCase().includes(term) ||
        product.batchId?.toLowerCase().includes(term) ||
        product.origin?.toLowerCase().includes(term) ||
        product.id?.toString().includes(term)
      );
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  /**
   * Refresh product list
   */
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};
      if (producerAddress) {
        params.producer = producerAddress;
      } else if (ownerAddress) {
        params.owner = ownerAddress;
      }
      
      const response = await productAPI.list(params);

      if (response.data.success) {
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      }
    } catch (err) {
      setError('Failed to refresh products');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="product-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-error">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={handleRefresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <div className="product-list-title">
          <h2>{ownerAddress || producerAddress ? 'My Products' : 'All Products'}</h2>
          <span className="product-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>
        <div className="product-list-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn btn-outline" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="product-list-empty">
          {searchTerm ? (
            <>
              <p>No products found matching "{searchTerm}"</p>
              <button className="btn btn-outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            </>
          ) : (
            <p>No products registered yet. Register your first product above!</p>
          )}
        </div>
      ) : (
        <div className="product-list-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentAccount={currentAccount}
              userRole={userRole}
              onViewDetails={onProductClick}
              onTransfer={onProductTransfer}
              onQualityCheck={onQualityCheck}
              onComplianceCheck={onComplianceCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
}

