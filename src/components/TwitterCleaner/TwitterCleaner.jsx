import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';
import { config } from '../../lib/config';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const REDIRECT_URI = 'https://twitter-cleaner-2.vercel.app/callback';

const TwitterCleaner = () => {
  // ... rest of the code stays the same until the fetch call ...

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const authError = params.get('error');
    const returnedState = params.get('state');

    if (code) {
      const verifier = localStorage.getItem('code_verifier');
      const savedState = localStorage.getItem('oauth_state');

      if (savedState !== returnedState) {
        setErrorMessage('Invalid state parameter');
        return;
      }

      if (!verifier) {
        setErrorMessage('Missing verifier');
        return;
      }

      setLoading(true);
      fetch('https://twitter-cleaner-2.vercel.app/api/auth/token', {  // Changed from '/api/auth/token'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: verifier,
          client_id: config.clientId,
          redirect_uri: REDIRECT_URI
        }),
      })
      .then(async (response) => {
        const data = await response.json();
        console.log('Token response:', data);  // Added debug log
        if (!response.ok) {
          throw new Error(data.error || 'Token exchange failed');
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
        console.error('Auth error:', err);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (authError) {
      setErrorMessage(authError === 'access_denied' 
        ? 'Access was denied. Please try signing in again.'
        : 'Authentication failed. Please try again.');
    }
  }, [location, navigate]);

  // ... rest of the code stays exactly the same ...
};

export default TwitterCleaner;
