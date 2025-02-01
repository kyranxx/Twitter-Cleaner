import { config } from './config';
import { TWITTER_CONFIG } from '../config/twitter';

const REDIRECT_URI = TWITTER_CONFIG.redirectUri;

// Helper function to generate random string
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Helper function for base64URL encoding
function base64URLEncode(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate code verifier
function generateCodeVerifier() {
  return generateRandomString(64);
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(digest);
}

export const generateAuthUrl = async () => {
  try {
    // Generate verifier
    const verifier = generateCodeVerifier();
    
    // Generate challenge
    const challenge = await generateCodeChallenge(verifier);

    // Generate state
    const state = generateRandomString(32);
    
    // Store values in localStorage
    localStorage.setItem('code_verifier', verifier);
    localStorage.setItem('oauth_state', state);

    // Construct auth URL with all required parameters
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CONFIG.clientId,
      redirect_uri: REDIRECT_URI,
      scope: TWITTER_CONFIG.scope,
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });

    return `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
  } catch (error) {
    console.error('Error generating auth URL:', error);
    throw new Error('Failed to generate authentication URL');
  }
};

export const handleTokenExchange = async ({ code, returnedState, onSuccess, onError }) => {
  try {
    // Validate required parameters
    if (!code || !returnedState) {
      throw new Error('Missing code or state parameter');
    }

    const verifier = localStorage.getItem('code_verifier');
    const savedState = localStorage.getItem('oauth_state');

    if (!verifier || !savedState) {
      throw new Error('Missing verifier or saved state');
    }

    if (savedState !== returnedState) {
      throw new Error('State mismatch - possible security issue');
    }

    // Make token exchange request to Vercel serverless function
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange failed:', errorData);
      throw new Error(errorData.error || 'Token exchange failed');
    }

    const data = await response.json();
    
    // Store token and clean up
    localStorage.setItem('twitter_token', data.access_token);
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('oauth_state');
    
    onSuccess?.(data);
    return data;
  } catch (error) {
    console.error('Auth error:', error);
    onError?.(error);
    throw error;
  }
};

export const validateState = (returnedState) => {
  const savedState = localStorage.getItem('oauth_state');
  return savedState === returnedState;
};

export const clearAuthData = () => {
  localStorage.removeItem('code_verifier');
  localStorage.removeItem('oauth_state');
  localStorage.removeItem('twitter_token');
};

export const getStoredToken = () => {
  return localStorage.getItem('twitter_token');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};
