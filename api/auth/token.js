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
    const { code, code_verifier } = req.body;
    const clientId = 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ';
    const redirectUri = 'https://twitter-cleaner-2.vercel.app';

    // Debug logging
    console.log('Token exchange attempt:', {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      redirectUri
    });

    if (!code || !code_verifier) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: {
          hasCode: !!code,
          hasVerifier: !!code_verifier
        }
      });
    }

    // Make token exchange request
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: code_verifier
      })
    });

    const responseText = await tokenResponse.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Twitter response:', responseText);
      return res.status(500).json({
        error: 'Invalid response from Twitter',
        details: responseText.substring(0, 200)
      });
    }

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        response: responseData
      });
      return res.status(tokenResponse.status).json({
        error: 'Twitter token exchange failed',
        details: responseData
      });
    }

    // Success
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({
      error: 'Token exchange failed',
      message: error.message
    });
  }
}
