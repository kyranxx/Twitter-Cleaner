import { useState } from 'react';
import { loginWithTwitter, logoutFromTwitter } from '../services/twitter';

export const useTwitterAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await loginWithTwitter();
      setError('');
      setIsAuthenticated(true);
    } catch (err) {
      setError('Failed to login with Twitter');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFromTwitter();
      setIsAuthenticated(false);
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return {
    isAuthenticated,
    error,
    handleLogin,
    handleLogout
  };
};
