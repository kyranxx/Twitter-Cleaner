// Get user tweets with pagination
export const getUserTweets = async (token) => {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me/tweets?max_results=100&tweet.fields=referenced_tweets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch tweets');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
};

// Delete a single tweet
export const deleteTweet = async (tweetId, token) => {
  try {
    const response = await fetch(`https://api.twitter.com/2/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete tweet');
    return true;
  } catch (error) {
    console.error('Error deleting tweet:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Batch delete tweets
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
    }
    
    if (onProgress) {
      onProgress(results);
    }
  }

  return results;
};
