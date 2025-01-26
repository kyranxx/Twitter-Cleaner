export default async function handler(req, res) {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    console.log('Received request:', {
      method: req.method,
      token: token ? 'present' : 'missing'
    });

    // Handle GET requests for fetching tweets
    if (req.method === 'GET') {
      // First get the user ID
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('User fetch failed:', errorData);
        return res.status(userResponse.status).json(errorData);
      }

      const userData = await userResponse.json();
      const userId = userData.data.id;

      // Then get their tweets
      const tweetsResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=referenced_tweets,created_at`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!tweetsResponse.ok) {
        const errorData = await tweetsResponse.json();
        console.error('Tweets fetch failed:', errorData);
        return res.status(tweetsResponse.status).json(errorData);
      }

      const tweetsData = await tweetsResponse.json();
      return res.status(200).json(tweetsData);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
