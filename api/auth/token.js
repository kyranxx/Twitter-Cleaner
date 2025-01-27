// file: /api/auth/token.js
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract body parameters
    const { code, code_verifier } = req.body;
    const clientId = process.env.TWITTER_CLIENT_ID;
    const redirectUri = 'https://twitter-cleaner-2.vercel.app/callback';

    // Validate required parameters
    if (!code || !code_verifier || !clientId) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: {
          hasCode: !!code,
          hasVerifier: !!code_verifier,
          hasClientId: !!clientId
        }
      });
    }

    console.log('Token exchange attempt with:', {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      hasClientId: !!clientId,
      redirectUri
    });

    // Prepare the token exchange request
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: code_verifier
      })
    });

    // Parse the response
    const responseText = await tokenResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return res.status(500).json({ error: 'Invalid response from Twitter' });
    }

    // Handle unsuccessful token response
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        response: responseData
      });
      return res.status(tokenResponse.status).json(responseData);
    }

    // Successful response
    console.log('Token exchange succeeded:', responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({
      error: 'Token exchange failed',
      message: error.message
    });
  }
}
