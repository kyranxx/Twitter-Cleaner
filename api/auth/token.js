export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier, redirect_uri } = req.body;

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    console.log('Attempting token exchange with params:', {
      client_id: process.env.VITE_TWITTER_CLIENT_ID ? 'present' : 'missing',
      code: code ? 'present' : 'missing',
      redirect_uri,
      code_verifier: code_verifier ? 'present' : 'missing'
    });

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_TWITTER_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier,
      }).toString()
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange failed:', error);
      return res.status(tokenResponse.status).json({
        error: error.error || 'Token exchange failed',
        details: error
      });
    }

    const data = await tokenResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange token',
      message: error.message
    });
  }
}
