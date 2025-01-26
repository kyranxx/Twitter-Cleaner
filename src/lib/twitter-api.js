// Get user tweets with pagination
export const getUserTweets = async (token) => {
  try {
    console.log('Fetching tweets...');
    const response = await fetch('/api/twitter/tweets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Tweet fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || 'Failed to fetch tweets');
    }

    const data = await response.json();
    console.log('Tweets fetched successfully:', {
      count: data.data?.length || 0
    });
    return data;
  } catch (error) {
    console.error('Error in getUserTweets:', error);
    throw error;
  }
};

// Delete a single tweet
export const deleteTweet = async (tweetId, token) => {
  try {
    const response = await fetch(`/api/twitter/tweets?tweetId=${tweetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

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

// Get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await fetch('/api/twitter/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user profile');
    }

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
      console.error(`Failed to delete tweet ${tweetId}:`, error);
    }
    
    if (onProgress) {
      onProgress(results);
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};
