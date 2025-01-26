export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier, redirect_uri } = req.body;
    const clientId = process.env.VITE_TWITTER_CLIENT_ID;

    if (!clientId) {
      console.error('Client ID not found in environment');
      return res.status(500).json({ error: 'Configuration error' });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      code_verifier: code_verifier,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    });

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Twitter API error:', {
        status: tokenResponse.status,
        response: errorText
      });
      return res.status(tokenResponse.status).json({ 
        error: 'Token exchange failed',
        details: errorText
      });
    }

    const data = await tokenResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: error.message });
  }
}
