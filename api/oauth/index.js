export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { code, code_verifier } = req.body;

      if (!code || !code_verifier) {
        return res.status(400).json({ error: 'Missing code or code_verifier' });
      }

      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: 'SmFPMml6WnoOekNWWDQ4bEpSd2I6MTpjaQ',
          redirect_uri: 'https://twitter-cleaner-2.vercel.app',
          code_verifier
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const data = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        return res.status(tokenResponse.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
