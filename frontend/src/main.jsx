/**
 * Main Entry Point
 * 
 * TODO: Set up React app
 * - Import React and ReactDOM
 * - Import App component
 * - Render App to root element
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// TODO: Get root element and render App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

