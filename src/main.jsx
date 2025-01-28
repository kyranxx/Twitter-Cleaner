import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
}
