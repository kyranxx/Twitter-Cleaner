export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier } = req.body;
    const clientId = process.env.VITE_TWITTER_CLIENT_ID;
    const redirectUri = 'https://twitter-cleaner-2.vercel.app/callback';

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

    const responseData = await tokenResponse.text();
    let data;
    try {
      data = JSON.parse(responseData);
    } catch (e) {
      console.error('Failed to parse response:', responseData);
      return res.status(500).json({ error: 'Invalid response from Twitter' });
    }

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        data
      });
      return res.status(tokenResponse.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange token',
      message: error.message 
    });
  }
}
