// Rate limiting constants
const RATE_LIMIT = {
  DELETE: {
    REQUESTS_PER_WINDOW: 50,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    DELAY_MS: 1000 // 1 second between requests
  }
};

export const getUserTweets = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await fetch('/api/twitter/tweets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('auth_error');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch tweets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

export const deleteTweet = async (tweetId, token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const response = await fetch(`/api/twitter/delete?tweetId=${tweetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('auth_error');
    }

    // Handle rate limiting
    if (response.status === 429) {
      const resetTime = response.headers.get('x-rate-limit-reset');
      const waitTime = (resetTime * 1000) - Date.now();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return deleteTweet(tweetId, token); // Retry after waiting
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete tweet');
    }

    return true;
  } catch (error) {
    console.error('Error deleting tweet:', error);
    throw error;
  }
};

export const batchDeleteTweets = async (tweetIds, token, onProgress) => {
  const results = {
    success: 0,
    failed: 0,
    total: tweetIds.length,
    rateLimitHits: 0
  };

  // Process tweets in chunks to respect rate limits
  const chunks = chunkArray(tweetIds, RATE_LIMIT.DELETE.REQUESTS_PER_WINDOW);

  for (const chunk of chunks) {
    for (const tweetId of chunk) {
      try {
        await deleteTweet(tweetId, token);
        results.success++;
      } catch (error) {
        results.failed++;
        if (error.message === 'auth_error') {
          throw error;
        }
        if (error.message.includes('rate limit')) {
          results.rateLimitHits++;
        }
      }
      
      if (onProgress) {
        onProgress(results);
      }

      // Respect rate limit
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.DELETE.DELAY_MS));
    }

    // Add a longer delay between chunks
    if (chunks.length > 1) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT.DELETE.DELAY_MS * 2)
      );
    }
  }

  return results;
};

// Helper function to chunk array
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
