import React, { useEffect, useState } from 'react';
import { Twitter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    
    if (code) {
      handleAuthCallback(code);
    } else if (error) {
      setError('Authentication failed: ' + error);
    }
  }, [location]);

  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    localStorage.setItem('codeVerifier', verifier);
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

  const handleLogin = async () => {
    try {
      setLoading(true);
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      const state = crypto.randomUUID();
      localStorage.setItem('authState', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read tweet.write users.read',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      window.location.href = `${TWITTER_AUTH_URL}?${params.toString()}`;
    } catch (err) {
      setError('Failed to initialize login');
      setLoading(false);
      console.error(err);
    }
  };

  const handleAuthCallback = async (code) => {
    try {
      setLoading(true);
      const verifier = localStorage.getItem('codeVerifier');
      const state = localStorage.getItem('authState');
      
      if (!verifier || !state) {
        throw new Error('Invalid authentication state');
      }

      // Clear stored auth data
      localStorage.removeItem('codeVerifier');
      localStorage.removeItem('authState');

      // Here you would typically exchange the code for tokens
      // For now, we'll just redirect to the main app
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-[var(--primary)]" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Twitter Account Cleaner</h1>
            </div>
            <p className="text-[#536471] text-sm">
              Safely remove your tweets and replies with just one click
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="twitter-login-button"
          >
            <Twitter />
            {loading ? 'Connecting...' : 'Login with Twitter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
