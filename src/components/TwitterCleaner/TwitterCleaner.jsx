const handleLogin = async () => {
  try {
    setLoading(true);
    setError(null);

    // 1. Generate code verifier
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    
    // 2. Store verifier securely
    if (typeof localStorage === 'undefined') {
      throw new Error('LocalStorage is not available');
    }
    localStorage.setItem('code_verifier', verifier);

    // 3. Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.VITE_TWITTER_CLIENT_ID || 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ',
      redirect_uri: process.env.VITE_TWITTER_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback',
      scope: 'tweet.read tweet.write users.read',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: crypto.randomUUID() // Add state parameter
    });

    window.location.href = `https://twitter.com/i/oauth2/authorize?${params}`;
    
  } catch (err) {
    console.error('🔴 Login Error:', err);
    setError(err.message || 'Failed to initialize login');
    setLoading(false);
  }
};
