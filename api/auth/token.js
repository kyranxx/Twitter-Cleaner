export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, code_verifier, redirect_uri } = req.body;
    const clientId = process.env.TWITTER_CLIENT_ID;

    console.log('Auth attempt with:', {
      clientIdExists: !!clientId,
      codeExists: !!code,
      verifierExists: !!code_verifier,
      redirect_uri
    });

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
      body: params.toString()
    });

    console.log('Twitter response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Twitter error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: 'Unknown error' };
      }
      
      return res.status(tokenResponse.status).json(errorData);
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
