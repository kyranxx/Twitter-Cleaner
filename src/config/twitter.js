// Helper functions for OAuth
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

export const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || 'SmEPNmlGNno0ekNWWDQ4bFpSd2I6MTpjaQ',
  redirectUri: import.meta.env.VITE_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback',
  scope: ['tweet.read', 'tweet.write', 'users.read'].join(' '),
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token'
};

export const generateTwitterAuthUrl = () => {
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(64);
  const encoder = new TextEncoder();
  
  return crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier))
    .then(buffer => {
      const challenge = btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // Store state and verifier
      localStorage.setItem('twitter_oauth_state', state);
      localStorage.setItem('twitter_code_verifier', codeVerifier);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CONFIG.clientId,
        redirect_uri: TWITTER_CONFIG.redirectUri,
        scope: TWITTER_CONFIG.scope,
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      return `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
    });
};

export const validateOAuthState = (returnedState) => {
  const savedState = localStorage.getItem('twitter_oauth_state');
  return savedState === returnedState;
};

export const getStoredCodeVerifier = () => {
  return localStorage.getItem('twitter_code_verifier');
};

export const clearOAuthData = () => {
  localStorage.removeItem('twitter_oauth_state');
  localStorage.removeItem('twitter_code_verifier');
};
