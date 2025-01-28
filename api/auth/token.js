export default async function handler(req, res) {
  const debugInfo = {
    method: req.method,
    headers: req.headers,
    timestamp: new Date().toISOString()
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      debug: debugInfo 
    });
  }

  try {
    const { code, code_verifier } = req.body;
    const clientId = 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ';
    const redirectUri = 'https://twitter-cleaner-2.vercel.app';

    debugInfo.requestBody = {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      redirectUri
    };

    if (!code || !code_verifier) {
      return res.status(400).json({
        error: 'Missing required parameters',
        debug: debugInfo,
        details: {
          hasCode: !!code,
          hasVerifier: !!code_verifier
        }
      });
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: code_verifier
    });

    debugInfo.twitterRequest = {
      url: 'https://api.twitter.com/2/oauth2/token',
      params: Object.fromEntries(params)
    };

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const responseText = await tokenResponse.text();
    debugInfo.twitterResponse = {
      status: tokenResponse.status,
      headers: Object.fromEntries(tokenResponse.headers),
      body: responseText.substring(0, 500) // First 500 chars for debugging
    };

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Twitter response:', responseText);
      return res.status(500).json({ 
        error: 'Invalid response from Twitter',
        debug: debugInfo
      });
    }

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        error: 'Twitter token exchange failed',
        debug: debugInfo,
        details: responseData
      });
    }

    return res.status(200).json({
      ...responseData,
      debug: process.env.NODE_ENV === 'development' ? debugInfo : undefined
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({
      error: 'Token exchange failed',
      message: error.message,
      debug: debugInfo
    });
  }
}
