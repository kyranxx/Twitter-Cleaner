// ... rest of imports stay the same

const TwitterCleaner = () => {
  // ... rest of the code stays the same until fetch call

  setLoading(true);
  fetch('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      code_verifier: verifier,
      client_id: config.clientId,      // Add client_id
      redirect_uri: REDIRECT_URI       // Add redirect_uri
    }),
  })
  .then(async (response) => {
    const data = await response.json();
    console.log('Token response:', data);  // Add debug log
    if (!response.ok) {
      throw new Error(data.error || 'Token exchange failed');
    }
    return data;
  })
  // ... rest of the code stays the same
};

export default TwitterCleaner;
