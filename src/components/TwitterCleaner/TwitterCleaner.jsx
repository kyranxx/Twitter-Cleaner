import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';
import { config } from '../../lib/config';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Generate verifier
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const verifier = btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Generate challenge
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const digest = await crypto.subtle.digest('SHA-256', data);
      const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Generate and store state
      const state = crypto.randomUUID();
      
      // Store values for later
      localStorage.setItem('code_verifier', verifier);
      localStorage.setItem('oauth_state', state);

      // Construct the authorization URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      // Redirect to Twitter's authorization page
      window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    } catch (err) {
      console.error('Login initialization error:', err);
      setErrorMessage('Failed to initialize login process');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');

    if (code) {
      const verifier = localStorage.getItem('code_verifier');
      const savedState = localStorage.getItem('oauth_state');

      if (!verifier || !savedState) {
        setErrorMessage('Missing authentication data - please try again');
        return;
      }

      if (state !== savedState) {
        setErrorMessage('Invalid state parameter - please try again');
        return;
      }

      setLoading(true);

      fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: verifier,
          redirect_uri: config.redirectUri
        }),
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to exchange token');
        }
        return data;
      })
      .then((data) => {
        localStorage.setItem('twitter_token', data.access_token);
        localStorage.removeItem('code_verifier');
        localStorage.removeItem('oauth_state');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Authentication error:', err);
        setErrorMessage(err.message || 'Authentication failed');
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (error) {
      setErrorMessage(
        error === 'access_denied' 
          ? 'Access was denied. Please try again.'
          : 'Authentication failed. Please try again.'
      );
    }
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
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition-colors"
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
