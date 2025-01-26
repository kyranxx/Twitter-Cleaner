export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier, redirect_uri } = req.body;

    console.log('Token exchange attempted with:', {
      code: code ? 'present' : 'missing',
      code_verifier: code_verifier ? 'present' : 'missing',
      redirect_uri,
      client_id: process.env.TWITTER_CLIENT_ID ? 'present' : 'missing'
    });

    // Verify all required parameters are present
    if (!code || !code_verifier || !redirect_uri) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: {
          code: !code,
          code_verifier: !code_verifier,
          redirect_uri: !redirect_uri
        }
      });
    }

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.TWITTER_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier,
      }).toString()
    });

    const responseText = await tokenResponse.text();
    console.log('Twitter API response:', {
      status: tokenResponse.status,
      response: responseText
    });

    if (!tokenResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { error: 'Invalid response from Twitter' };
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
