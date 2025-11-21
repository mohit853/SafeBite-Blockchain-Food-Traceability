/**
 * Home Page
 * Landing page that shows role-based dashboard access
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useRole } from '../hooks/useRole';
import { ROLES, ROLE_NAMES } from '../utils/constants';
import { formatAddress } from '../utils/helpers';
import './Home.css';

/**
 * Home Component
 * 
 * Shows welcome message and role-based dashboard cards.
 * Auto-redirects to appropriate dashboard if user has a specific role.
 */
export default function Home() {
  const { account, isConnected } = useWeb3();
  const { role, roleName, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  /**
   * Auto-redirect to role-specific dashboard if user has a non-consumer role
   */
  useEffect(() => {
    if (isConnected && !roleLoading && role !== null && role !== ROLES.CONSUMER) {
      const roleRoutes = {
        [ROLES.PRODUCER]: '/producer',
        [ROLES.DISTRIBUTOR]: '/distributor',
        [ROLES.RETAILER]: '/retailer',
        [ROLES.REGULATOR]: '/regulator'
      };

      if (roleRoutes[role]) {
        navigate(roleRoutes[role]);
      }
    }
  }, [isConnected, role, roleLoading, navigate]);

  if (!isConnected) {
    return (
      <div className="home-page">
        <div className="home-hero">
          <h1>Welcome to SafeBite</h1>
          <p className="hero-subtitle">
            Blockchain-based Food Supply Chain Verification System
          </p>
          <p className="hero-description">
            Connect your MetaMask wallet to get started
          </p>
        </div>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="home-page">
        <div className="home-loading">
          <div className="loading-spinner"></div>
          <p>Loading your role...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Welcome to SafeBite</h1>
          <p className="welcome-message">
            {roleName && role !== ROLES.CONSUMER
              ? `You are logged in as a ${roleName}`
              : 'Select your dashboard to get started'}
          </p>
          {account && (
            <p className="account-info">
              Account: <span className="account-address">{formatAddress(account)}</span>
            </p>
          )}
        </div>

        <div className="dashboard-cards">
          <div
            className={`dashboard-card ${role === ROLES.PRODUCER ? 'current-role' : ''}`}
            onClick={() => navigate('/producer')}
          >
            <div className="card-icon">🏭</div>
            <h3>Producer Dashboard</h3>
            <p>Register products and manage your inventory</p>
            {role === ROLES.PRODUCER && <span className="role-badge">Your Role</span>}
          </div>

          <div
            className={`dashboard-card ${role === ROLES.DISTRIBUTOR ? 'current-role' : ''}`}
            onClick={() => navigate('/distributor')}
          >
            <div className="card-icon">🚚</div>
            <h3>Distributor Dashboard</h3>
            <p>Receive and transfer products through the supply chain</p>
            {role === ROLES.DISTRIBUTOR && <span className="role-badge">Your Role</span>}
          </div>

          <div
            className={`dashboard-card ${role === ROLES.RETAILER ? 'current-role' : ''}`}
            onClick={() => navigate('/retailer')}
          >
            <div className="card-icon">🏪</div>
            <h3>Retailer Dashboard</h3>
            <p>Manage inventory and perform quality checks</p>
            {role === ROLES.RETAILER && <span className="role-badge">Your Role</span>}
          </div>

          <div
            className={`dashboard-card ${role === ROLES.REGULATOR ? 'current-role' : ''}`}
            onClick={() => navigate('/regulator')}
          >
            <div className="card-icon">⚖️</div>
            <h3>Regulator Dashboard</h3>
            <p>Perform compliance checks and audits</p>
            {role === ROLES.REGULATOR && <span className="role-badge">Your Role</span>}
          </div>

          <div
            className={`dashboard-card ${role === ROLES.CONSUMER ? 'current-role' : ''}`}
            onClick={() => navigate('/consumer')}
          >
            <div className="card-icon">👤</div>
            <h3>Consumer Dashboard</h3>
            <p>Verify products and view provenance</p>
            {role === ROLES.CONSUMER && <span className="role-badge">Your Role</span>}
          </div>
        </div>

        <div className="home-actions">
          <button
            className="btn-verify"
            onClick={() => navigate('/verify')}
          >
            Verify a Product
          </button>
        </div>
      </div>
    </div>
  );
}

