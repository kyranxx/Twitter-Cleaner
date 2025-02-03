import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter, 
  RouterProvider, 
  redirect
} from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';
import Dashboard from './components/TwitterCleaner/Dashboard';
import TwitterCallback from './components/TwitterCallback/TwitterCallback';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Auth loader function
async function authLoader() {
  const token = localStorage.getItem('twitter_token');
  if (!token) {
    // Clear any stale data
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('twitter_cleaner_v2_oauth_state');
    localStorage.removeItem('twitter_cleaner_v2_token');
    throw redirect('/');
  }
  return { isAuthenticated: true };
}

// Create router with data API
const router = createBrowserRouter([
  {
    path: '/',
    element: <TwitterCleaner />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/callback',
    element: <TwitterCallback />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
    loader: authLoader,
  },
  {
    path: '*',
    loader: () => redirect('/'),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

// Create root with automatic batching
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render with transitions enabled
root.render(
  <React.StrictMode>
    <RouterProvider 
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  </React.StrictMode>
);
