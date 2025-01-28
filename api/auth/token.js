export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and validate required parameters
    const { code, code_verifier, redirect_uri } = req.body;

    if (!code || !code_verifier || !redirect_uri) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: {
          hasCode: !!code,
          hasVerifier: !!code_verifier,
          hasRedirectUri: !!redirect_uri
        }
      });
    }

    // Ensure environment variables are set
    const clientId = process.env.TWITTER_CLIENT_ID;
    if (!clientId) {
      console.error('Missing TWITTER_CLIENT_ID environment variable');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Make token exchange request to Twitter
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri,
        code_verifier
      })
    });

    // Get response as text first to handle potential JSON parse errors
    const responseText = await tokenResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Twitter response:', responseText);
      return res.status(500).json({ 
        error: 'Invalid response from Twitter',
        details: responseText.substring(0, 100) // Log first 100 chars for debugging
      });
    }

    // Handle unsuccessful responses from Twitter
    if (!tokenResponse.ok) {
      console.error('Twitter token exchange failed:', {
        status: tokenResponse.status,
        response: responseData
      });
      return res.status(tokenResponse.status).json({
        error: 'Twitter token exchange failed',
        details: responseData
      });
    }

    // Return successful response
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({
      error: 'Token exchange failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
