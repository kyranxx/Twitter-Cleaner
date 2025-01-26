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

    const response = await fetch(`/api/twitter/tweets?tweetId=${tweetId}`, {
      method: 'DELETE',
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
    total: tweetIds.length
  };

  for (const tweetId of tweetIds) {
    try {
      await deleteTweet(tweetId, token);
      results.success++;
    } catch (error) {
      results.failed++;
      if (error.message === 'auth_error') {
        throw error;
      }
    }
    
    if (onProgress) {
      onProgress(results);
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};
