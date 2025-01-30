import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate code verifier
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      
      // Store for later
      localStorage.setItem('code_verifier', verifier);

      // Redirect to Twitter
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.VITE_TWITTER_CLIENT_ID || 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ',
        redirect_uri: process.env.VITE_TWITTER_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback',
        scope: 'tweet.read tweet.write users.read',
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      window.location.href = `https://twitter.com/i/oauth2/authorize?${params}`;
    } catch (err) {
      setError('Failed to initialize login');
      setLoading(false);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (code) {
      const verifier = localStorage.getItem('code_verifier');
      
      if (!verifier) {
        setError('Missing authentication data');
        return;
      }

      setLoading(true);

      fetch('/api/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: verifier
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        localStorage.setItem('twitter_token', data.access_token);
        localStorage.removeItem('code_verifier');
        navigate('/dashboard');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (error) {
      setError(error === 'access_denied' 
        ? 'Access was denied' 
        : 'Authentication failed');
    }
  }, [location, navigate]);

  // Helper functions
  function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
