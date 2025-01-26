// Detailed error logging
const logError = (error, context) => {
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    context
  });
};

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
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
        const errorData = await deleteResponse.json();
        logError(new Error('Tweet deletion failed'), {
          status: deleteResponse.status,
          data: errorData
        });
        return res.status(deleteResponse.status).json(errorData);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      logError(error, 'Delete tweet error');
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
        const errorData = await userResponse.json();
        logError(new Error('User fetch failed'), {
          status: userResponse.status,
          data: errorData
        });
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
        logError(new Error('Tweets fetch failed'), {
          status: tweetsResponse.status,
          data: errorData
        });
        return res.status(tweetsResponse.status).json(errorData);
      }

      const tweetsData = await tweetsResponse.json();
      return res.status(200).json(tweetsData);
    } catch (error) {
      logError(error, 'Get tweets error');
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
