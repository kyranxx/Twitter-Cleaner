import { TWITTER_CONFIG } from '../config/twitter';

export const generateAuthUrl = async () => {
  try {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state = crypto.randomUUID();
    
    localStorage.setItem('code_verifier', verifier);
    localStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CONFIG.clientId,
      redirect_uri: TWITTER_CONFIG.redirectUri,
      scope: TWITTER_CONFIG.scope,
      state: state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });

    return `${TWITTER_CONFIG.authUrl}?${params}`;
  } catch (error) {
    console.error('Error generating auth URL:', error);
    throw new Error('Failed to generate authentication URL');
  }
};

export const handleTokenExchange = async ({ code, returnedState }) => {
  try {
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

    const response = await fetch(TWITTER_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: TWITTER_CONFIG.redirectUri,
        client_id: TWITTER_CONFIG.clientId,
        code_verifier: verifier,
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('twitter_token', data.access_token);
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('oauth_state');

    return data;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
};
