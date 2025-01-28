import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';
import { config } from '../../lib/config';
import { generateAuthUrl, handleTokenExchange } from '../../lib/auth-utils';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const authUrl = await generateAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setErrorMessage('Failed to initialize login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const authError = params.get('error');
    const returnedState = params.get('state');

    if (!code) {
      if (authError) {
        setErrorMessage(authError === 'access_denied' 
          ? 'Access was denied. Please try signing in again.'
          : 'Authentication failed. Please try again.');
      }
      return;
    }

    const handleAuth = async () => {
      try {
        setLoading(true);
        await handleTokenExchange({
          code,
          returnedState,
          onSuccess: () => navigate('/dashboard'),
          onError: (error) => setErrorMessage(error.message)
        });
      } catch (error) {
        console.error('Auth error:', error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <XLogo className="h-8 w-8 text-[var(--foreground)]" />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-[var(--foreground)]">
            Clean Your Twitter Account
          </h1>
          
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="twitter-login-button w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <XLogo className="h-5 w-5" />
                Sign in with Twitter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
