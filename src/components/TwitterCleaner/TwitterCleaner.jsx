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
        client_id: 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ',
        redirect_uri: 'https://twitter-cleaner-2.vercel.app',
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
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div className="flex justify-center">
            <XLogo className="h-8 w-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-center">
            Clean Your Twitter Account
          </h1>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
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
