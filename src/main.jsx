import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const root = document.getElementById('root');

if (process.env.NODE_ENV !== 'production') {
  console.log('Mounting app with root element:', root);
}

if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    // Display a visible error on the page
    root.innerHTML = `
      <div style="padding: 20px; color: red;">
        Failed to load application. Please check console for details.
      </div>
    `;
  }
} else {
  console.error('Root element not found');
}
