import { config } from './config';

export const generateAuthUrl = async () => {
  try {
    // Generate verifier
    const verifier = generateCodeVerifier();
    
    // Generate challenge
    const challenge = await generateCodeChallenge(verifier);

    // Generate state
    const state = crypto.randomUUID();
    
    // Store values in localStorage
    localStorage.setItem('code_verifier', verifier);
    localStorage.setItem('oauth_state', state);

    // Construct auth URL with all required parameters
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'tweet.read tweet.write users.read offline.access',
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

    // Make token exchange request
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        redirect_uri: config.redirectUri,
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

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode.apply(null, buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
