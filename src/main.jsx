import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found! Add <div id="root"></div> to your HTML');
  }

  const root = createRoot(container);
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    container.innerHTML = `
      <div style="padding: 20px; color: red; text-align: center;">
        <h1>Error Loading Application</h1>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
          ${error.message}
        </pre>
      </div>
    `;
  }
});
