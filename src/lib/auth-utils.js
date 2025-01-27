export const exchangeToken = async (code, codeVerifier, redirectUri) => {
  try {
    // Validate input parameters
    if (!code || !codeVerifier || !redirectUri) {
      throw new Error('Missing required parameters for token exchange');
    }

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_TWITTER_CLIENT_ID,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Failed to exchange token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
};
