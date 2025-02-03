// Environment detection
const isDevelopment = import.meta.env.NODE_ENV === 'development';

// Twitter API Configuration
export const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
  redirectUri: isDevelopment 
    ? import.meta.env.VITE_TWITTER_REDIRECT_URI_DEV 
    : import.meta.env.VITE_TWITTER_REDIRECT_URI_PROD,
  scope: import.meta.env.VITE_TWITTER_SCOPE || 'tweet.read tweet.write users.read offline.access',
  authUrl: import.meta.env.VITE_TWITTER_AUTH_URL || 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: import.meta.env.VITE_TWITTER_TOKEN_URL || 'https://api.twitter.com/2/oauth2/token',
  apiUrl: import.meta.env.VITE_TWITTER_API_URL || 'https://api.twitter.com/2',
  baseUrl: isDevelopment 
    ? import.meta.env.VITE_API_BASE_URL_DEV 
    : import.meta.env.VITE_API_BASE_URL_PROD,
  // Rate limiting configuration
  rateLimits: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    exponentialBackoff: true
  }
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'twitter_cleaner_v2_token',
  STATE: 'twitter_cleaner_v2_oauth_state',
  CODE_VERIFIER: 'twitter_cleaner_v2_code_verifier',
  RATE_LIMIT: 'twitter_cleaner_v2_rate_limit'
};

// Rate limit handling
const rateLimitHandler = {
  get() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RATE_LIMIT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  set(resetTime) {
    localStorage.setItem(STORAGE_KEYS.RATE_LIMIT, JSON.stringify({
      resetTime,
      timestamp: Date.now()
    }));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEYS.RATE_LIMIT);
  },
  isLimited() {
    const data = this.get();
    if (!data) return false;
    return Date.now() < data.resetTime;
  }
};

// Base64URL encoding function
function base64URLEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate random string for PKCE
function generateRandomString(length) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

// Generate code challenge using SHA-256
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64Digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Secure storage implementation
const secureStorage = {
  set(key, value) {
    try {
      const data = JSON.stringify(value);
      const encoded = base64URLEncode(data);
      localStorage.setItem(`${STORAGE_KEYS.TOKEN}_${key}`, encoded);
    } catch (error) {
      console.error('Failed to store data:', error);
      throw new Error('Storage error: Failed to save data securely');
    }
  },

  get(key) {
    try {
      const encoded = localStorage.getItem(`${STORAGE_KEYS.TOKEN}_${key}`);
      if (!encoded) return null;
      const data = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(`${STORAGE_KEYS.TOKEN}_${key}`);
  }
};

// Generate Twitter auth URL with PKCE
export async function generateTwitterAuthUrl() {
  return retryWithBackoff(async () => {
    try {
      // Verify client ID
      if (!TWITTER_CONFIG.clientId) {
        throw new Error('Twitter Client ID is not configured');
      }

      // Generate and store PKCE values
      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store PKCE and state data
      secureStorage.set(STORAGE_KEYS.STATE, {
        state,
        timestamp: Date.now(),
        codeVerifier
      });

      // Build auth URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: TWITTER_CONFIG.clientId,
        redirect_uri: TWITTER_CONFIG.redirectUri,
        scope: TWITTER_CONFIG.scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      const authUrl = `${TWITTER_CONFIG.authUrl}?${params.toString()}`;
      console.log('Generated auth URL with params:', {
        clientId: TWITTER_CONFIG.clientId.slice(0, 8) + '...',
        redirectUri: TWITTER_CONFIG.redirectUri,
        scope: TWITTER_CONFIG.scope,
        state: state.slice(0, 8) + '...',
        codeChallenge: codeChallenge.slice(0, 8) + '...',
        environment: isDevelopment ? 'development' : 'production'
      });
      return authUrl;
    } catch (error) {
      console.error('Failed to generate auth URL:', error);
      throw new Error(
        error.message === 'Twitter Client ID is not configured'
          ? 'Twitter Client ID is not properly configured. Please check your settings.'
          : 'Authentication initialization failed. Please try again.'
      );
    }
  });
}

// Retry function with exponential backoff
async function retryWithBackoff(fn, retries = TWITTER_CONFIG.rateLimits.maxRetries) {
  try {
    if (rateLimitHandler.isLimited()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    return await fn();
  } catch (error) {
    if (error.status === 429) { // Rate limit exceeded
      const resetTime = error.headers?.get('x-rate-limit-reset');
      if (resetTime) {
        rateLimitHandler.set(parseInt(resetTime) * 1000);
      }
    }
    
    if (retries <= 0) throw error;
    
    const delay = TWITTER_CONFIG.rateLimits.exponentialBackoff
      ? TWITTER_CONFIG.rateLimits.retryDelay * Math.pow(2, TWITTER_CONFIG.rateLimits.maxRetries - retries)
      : TWITTER_CONFIG.rateLimits.retryDelay;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1);
  }
}

// Validate OAuth state
export function validateOAuthState(returnedState) {
  try {
    const storedData = secureStorage.get(STORAGE_KEYS.STATE);
    if (!storedData) {
      throw new Error('No stored authentication data found');
    }

    // Check if state is expired (10 minutes)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      clearOAuthData();
      throw new Error('Authentication session expired');
    }

    if (storedData.state !== returnedState) {
      throw new Error('Invalid authentication state');
    }

    return true;
  } catch (error) {
    console.error('OAuth state validation failed:', error);
    return false;
  }
}

// Get stored code verifier
export function getStoredCodeVerifier() {
  const data = secureStorage.get(STORAGE_KEYS.STATE);
  return data?.codeVerifier;
}

// Store access token
export function storeToken(tokenData) {
  try {
    const data = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      scope: tokenData.scope
    };
    secureStorage.set(STORAGE_KEYS.TOKEN, data);
    return data.accessToken;
  } catch (error) {
    console.error('Failed to store token:', error);
    throw new Error('Failed to save authentication data');
  }
}

// Get stored token
export async function getStoredToken() {
  try {
    const data = secureStorage.get(STORAGE_KEYS.TOKEN);
    if (!data) return null;

    // Check if token is expired or about to expire (5 minutes buffer)
    if (Date.now() >= (data.expiresAt - 5 * 60 * 1000)) {
      if (data.refreshToken) {
        return await refreshAccessToken(data.refreshToken);
      }
      clearOAuthData();
      return null;
    }

    return data.accessToken;
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
}

// Refresh access token
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
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const tokenData = await response.json();
    return storeToken(tokenData);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearOAuthData();
    return null;
  }
}

// Clear OAuth data
export function clearOAuthData() {
  secureStorage.remove(STORAGE_KEYS.TOKEN);
  secureStorage.remove(STORAGE_KEYS.STATE);
  rateLimitHandler.clear();
}
