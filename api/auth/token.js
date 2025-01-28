export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier } = req.body;
    
    // Log request details (sanitized)
    console.log('Processing token request:', {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      method: req.method,
      headers: Object.keys(req.headers)
    });

    if (!code || !code_verifier) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['code', 'code_verifier']
      });
    }

    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ',
      redirect_uri: 'https://twitter-cleaner-2.vercel.app',
      code_verifier: code_verifier,
      code: code
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    });

    let data;
    const responseText = await response.text();
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return res.status(500).json({
        error: 'Invalid response format',
        details: responseText.substring(0, 100)
      });
    }

    // Log response status
    console.log('Twitter response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: typeof data === 'object' ? 'parsed-json' : typeof data
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || 'Token exchange failed',
        details: data
      });
    }

    // Return the successful response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
