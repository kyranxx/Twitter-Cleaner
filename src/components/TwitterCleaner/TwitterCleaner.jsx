import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const REDIRECT_URI = 'https://twitter-cleaner-2.vercel.app/callback';
const CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return verifier;
  };

  const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const handleAuthCallback = async (code, returnedState) => {
    try {
      const verifier = localStorage.getItem('codeVerifier');
      const originalState = localStorage.getItem('authState');
      
      if (!verifier || !originalState) {
        throw new Error('Invalid authentication state');
      }

      if (originalState !== returnedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange the code for a token
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: verifier,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Token exchange failed');
      }

      const data = await response.json();
      localStorage.setItem('twitter_token', data.access_token);
      localStorage.removeItem('codeVerifier');
      localStorage.removeItem('authState');
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const verifier = generateCodeVerifier();
      localStorage.setItem('codeVerifier', verifier);
      
      const challenge = await generateCodeChallenge(verifier);
      const state = crypto.randomUUID();
      localStorage.setItem('authState', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read tweet.write users.read',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      console.log('Initiating auth with params:', {
        client_id: CLIENT_ID ? 'present' : 'missing',
        redirect_uri: REDIRECT_URI,
        code_challenge: challenge ? 'present' : 'missing'
      });

      window.location.href = `${TWITTER_AUTH_URL}?${params.toString()}`;
    } catch (err) {
      setError('Failed to initialize login');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const authError = params.get('error');
    const state = params.get('state');
    
    if (code) {
      handleAuthCallback(code, state);
    } else if (authError) {
      setError(authError === 'access_denied' 
        ? 'Access was denied. Please try signing in again.'
        : 'Authentication failed. Please try again.');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <XLogo className="h-5 w-5" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Account Cleaner</h1>
            </div>
            <p className="text-[#536471] text-sm">
              Safely remove your posts and replies with just one click
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-red-800">Authentication Failed</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Sign in
                <XLogo className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
