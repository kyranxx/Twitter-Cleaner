import { config } from './config';

export const generateAuthUrl = async () => {
  try {
    // Generate verifier
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = generateCodeVerifier(array);
    
    // Generate challenge
    const challenge = await generateCodeChallenge(verifier);

    // Generate state
    const state = crypto.randomUUID();
    
    // Store values
    localStorage.setItem('code_verifier', verifier);
    localStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'tweet.read tweet.write users.read',
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  } catch (error) {
    console.error('Error generating auth URL:', error);
    throw new Error('Failed to generate authentication URL');
  }
};

export const handleTokenExchange = async ({ code, returnedState, onSuccess, onError }) => {
  try {
    const verifier = localStorage.getItem('code_verifier');
    const savedState = localStorage.getItem('oauth_state');

    if (!verifier || !savedState) {
      throw new Error('Missing authentication data');
    }

    if (savedState !== returnedState) {
      throw new Error('Invalid state parameter');
    }

    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        client_id: config.clientId,
        redirect_uri: config.redirectUri
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Token exchange failed');
    }

    localStorage.setItem('twitter_token', data.access_token);
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('oauth_state');
    
    onSuccess?.();
    return data;
  } catch (error) {
    onError?.(error);
    throw error;
  }
};

function generateCodeVerifier(array) {
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
