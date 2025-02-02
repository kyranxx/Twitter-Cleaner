export const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || 'SmEPNmlGNno0ekNWWDQ4bFpSd2I6MTpjaQ',
  redirectUri: import.meta.env.VITE_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback',
  scope: 'tweet.read tweet.write users.read offline.access',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  tokenExpiryBuffer: 300, // 5 minutes buffer before token expiry
};

// Encryption key for token storage
const STORAGE_KEY = 'twitter_cleaner_v1';
const ENCRYPTION_KEY = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

// Token storage with encryption
const secureStorage = {
  async encrypt(data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      ENCRYPTION_KEY,
      encodedData
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    };
  },

  async decrypt(encryptedData) {
    try {
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        ENCRYPTION_KEY,
        new Uint8Array(encryptedData.data)
      );

      return JSON.parse(new TextDecoder().decode(decryptedData));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  },

  async set(key, value) {
    const encrypted = await this.encrypt(value);
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(encrypted));
  },

  async get(key) {
    const encrypted = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (!encrypted) return null;
    return await this.decrypt(JSON.parse(encrypted));
  },

  remove(key) {
    localStorage.removeItem(`${STORAGE_KEY}_${key}`);
  }
};

// Enhanced PKCE implementation
export const generateTwitterAuthUrl = async () => {
  const state = generateRandomString(32);
  const codeVerifier = generateRandomString(64);
  const encoder = new TextEncoder();
  
  try {
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier));
    const challenge = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Store auth state securely
    await secureStorage.set('oauth_state', {
      state,
      codeVerifier,
      timestamp: Date.now()
    });

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
  } catch (error) {
    console.error('Failed to generate auth URL:', error);
    throw new Error('Failed to initialize authentication');
  }
};

// Enhanced random string generation
function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(x => charset[x % charset.length]).join('');
}

// Enhanced OAuth state validation
export const validateOAuthState = async (returnedState) => {
  try {
    const storedData = await secureStorage.get('oauth_state');
    if (!storedData) return false;

    // Check if the state is expired (10 minutes)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      await clearOAuthData();
      return false;
    }

    return storedData.state === returnedState;
  } catch (error) {
    console.error('Failed to validate OAuth state:', error);
    return false;
  }
};

export const getStoredCodeVerifier = async () => {
  try {
    const storedData = await secureStorage.get('oauth_state');
    return storedData?.codeVerifier || null;
  } catch (error) {
    console.error('Failed to get code verifier:', error);
    return null;
  }
};

// Token management
export const getStoredToken = async () => {
  try {
    const tokenData = await secureStorage.get('token');
    if (!tokenData) return null;

    // Check if token is expired or about to expire
    if (Date.now() >= (tokenData.expiresAt - TWITTER_CONFIG.tokenExpiryBuffer * 1000)) {
      if (tokenData.refreshToken) {
        return await refreshAccessToken(tokenData.refreshToken);
      }
      await clearOAuthData();
      return null;
    }

    return tokenData.accessToken;
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
};

export const storeToken = async (tokenResponse) => {
  try {
    const tokenData = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
      scope: tokenResponse.scope
    };

    await secureStorage.set('token', tokenData);
    return tokenData.accessToken;
  } catch (error) {
    console.error('Failed to store token:', error);
    throw error;
  }
};

async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch(TWITTER_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: TWITTER_CONFIG.clientId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokenData = await response.json();
    return await storeToken(tokenData);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    await clearOAuthData();
    return null;
  }
}

export const clearOAuthData = async () => {
  try {
    secureStorage.remove('oauth_state');
    secureStorage.remove('token');
  } catch (error) {
    console.error('Failed to clear OAuth data:', error);
  }
};
