export default async function handler(req, res) {
  // ... CORS handling stays the same

  try {
    const { code, code_verifier, client_id, redirect_uri } = req.body;
    
    // Debug log
    console.log('Received parameters:', {
      hasCode: !!code,
      hasVerifier: !!code_verifier,
      hasClientId: !!client_id,
      hasRedirectUri: !!redirect_uri
    });

    // Validate all required parameters
    if (!code || !code_verifier || !client_id || !redirect_uri) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: {
          hasCode: !!code,
          hasVerifier: !!code_verifier,
          hasClientId: !!client_id,
          hasRedirectUri: !!redirect_uri
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
        client_id,
        redirect_uri,
        code_verifier: code_verifier
      })
    });

    // ... rest of the code stays the same
  } catch (error) {
    // ... error handling stays the same
  }
}
