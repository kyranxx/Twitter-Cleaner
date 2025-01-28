import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';

// Constants
const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const CLIENT_ID = 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ';
const REDIRECT_URI = 'https://twitter-cleaner-2.vercel.app';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setDebugInfo(null);

      // Generate PKCE verifier
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

      // Generate state
      const state = crypto.randomUUID();

      // Store PKCE values
      localStorage.setItem('code_verifier', verifier);
      localStorage.setItem('oauth_state', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      const authUrl = `${TWITTER_AUTH_URL}?${params.toString()}`;
      console.log('Auth URL:', authUrl);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Failed to initialize login');
      setDebugInfo(JSON.stringify(err, null, 2));
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

      console.log('OAuth callback received:', {
        code: code ? 'present' : 'missing',
        state: state ? 'present' : 'missing',
        verifier: verifier ? 'present' : 'missing',
        savedState: savedState ? 'present' : 'missing'
      });

      if (!verifier || !savedState) {
        setErrorMessage('Missing authentication data - please try again');
        setDebugInfo(JSON.stringify({
          hasVerifier: !!verifier,
          hasSavedState: !!savedState
        }, null, 2));
        return;
      }

      if (state !== savedState) {
        setErrorMessage('Invalid state parameter - please try again');
        setDebugInfo(JSON.stringify({
          receivedState: state,
          savedState
        }, null, 2));
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
        }),
      })
      .then(async (response) => {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (!response.ok) {
            throw new Error(data.error || `Token exchange failed: ${response.status}`);
          }
          return data;
        } catch (e) {
          console.error('Response parse error:', text);
          throw new Error(`Failed to parse response: ${text.substring(0, 100)}`);
        }
      })
      .then((data) => {
        localStorage.setItem('twitter_token', data.access_token);
        localStorage.removeItem('code_verifier');
        localStorage.removeItem('oauth_state');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Auth error:', err);
        setErrorMessage(err.message || 'Authentication failed');
        setDebugInfo(JSON.stringify(err, null, 2));
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (error) {
      setErrorMessage(error === 'access_denied' 
        ? 'Access was denied. Please try again.'
        : `Authentication failed: ${error}`);
      setDebugInfo(JSON.stringify({
        error,
        description: params.get('error_description')
      }, null, 2));
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
            <div className="flex flex-col gap-2 text-red-500 bg-red-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
              {debugInfo && (
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                  {debugInfo}
                </pre>
              )}
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
