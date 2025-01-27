import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';
import { config } from '../../lib/config';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const REDIRECT_URI = 'https://twitter-cleaner-2.vercel.app/callback';

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

      // Store verifier for later use
      localStorage.setItem('code_verifier', verifier);

      // Generate and store state
      const state = crypto.randomUUID();
      localStorage.setItem('oauth_state', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      window.location.href = `${TWITTER_AUTH_URL}?${params.toString()}`;
    } catch (err) {
      setErrorMessage('Failed to initialize login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same ...
};

export default TwitterCleaner;
