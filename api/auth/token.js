export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier, redirect_uri } = req.body;
    const clientId = process.env.VITE_TWITTER_CLIENT_ID;

    if (!clientId) {
      console.error('Missing client ID');
      return res.status(500).json({ error: 'Configuration error' });
    }

    console.log('Token exchange attempt:', {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      redirect_uri,
      hasClientId: !!clientId
    });

    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: redirect_uri,
      code_verifier: code_verifier
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    });

    const responseText = await tokenResponse.text();
    console.log('Twitter response:', {
      status: tokenResponse.status,
      response: responseText
    });

    if (!tokenResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: 'Token exchange failed' };
      }
      return res.status(tokenResponse.status).json(errorData);
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange token',
      message: error.message 
    });
  }
}
