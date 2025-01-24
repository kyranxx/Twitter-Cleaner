export const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
  redirectUri: import.meta.env.VITE_TWITTER_REDIRECT_URI,
  scope: ['tweet.read', 'tweet.write', 'users.read'].join(' '),
  authUrl: 'https://twitter.com/i/oauth2/authorize',
};

export const generateTwitterAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CONFIG.clientId,
    redirect_uri: TWITTER_CONFIG.redirectUri,
    scope: TWITTER_CONFIG.scope,
    state: crypto.randomUUID(),
    code_challenge_method: 'S256',
    code_challenge: generateCodeChallenge(),
  });

  return `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
};

async function generateCodeChallenge() {
  const codeVerifier = generateCodeVerifier();
  localStorage.setItem('code_verifier', codeVerifier);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  return base64UrlEncode(digest);
}

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
