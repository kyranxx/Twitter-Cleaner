export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Handle DELETE requests for tweet deletion
  if (req.method === 'DELETE') {
    const { tweetId } = req.query;
    
    try {
      const deleteResponse = await fetch(
        `https://api.twitter.com/2/tweets/${tweetId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete tweet');
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle GET requests for fetching tweets
  if (req.method === 'GET') {
    try {
      // First get the user ID
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
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
        throw new Error('Failed to fetch tweets');
      }

      const tweetsData = await tweetsResponse.json();
      return res.status(200).json(tweetsData);
    } catch (error) {
      console.error('Twitter API error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
