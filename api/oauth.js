export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { code, codeVerifier, redirectUri } = request.body;

  try {
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_TWITTER_CLIENT_ID,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    const data = await tokenResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return response.status(500).json({ error: 'Failed to exchange token' });
  }
}
