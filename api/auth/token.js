export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, code_verifier, redirect_uri } = req.body;

  try {
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
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return res.status(tokenResponse.status).json(error);
    }

    const data = await tokenResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
}
