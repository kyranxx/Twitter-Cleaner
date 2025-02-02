// Rate limiting constants and error types
const RATE_LIMIT = {
  DELETE: {
    REQUESTS_PER_WINDOW: 50,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    DELAY_MS: 1000, // 1 second between requests
    MAX_RETRIES: 3, // Maximum number of retries for failed requests
    BACKOFF_MULTIPLIER: 2 // Exponential backoff multiplier
  }
};

const ERROR_TYPES = {
  AUTH_ERROR: 'auth_error',
  RATE_LIMIT: 'rate_limit',
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error'
};

// Helper function for exponential backoff
const calculateBackoff = (attempt, baseDelay = RATE_LIMIT.DELETE.DELAY_MS) => {
  return Math.min(
    baseDelay * Math.pow(RATE_LIMIT.DELETE.BACKOFF_MULTIPLIER, attempt),
    RATE_LIMIT.DELETE.WINDOW_MS
  );
};

// Helper function to handle API responses
const handleApiResponse = async (response, endpoint) => {
  if (response.status === 401) {
    throw new Error(ERROR_TYPES.AUTH_ERROR);
  }

  if (response.status === 429) {
    const resetTime = response.headers.get('x-rate-limit-reset');
    const waitTime = resetTime ? (resetTime * 1000) - Date.now() : RATE_LIMIT.DELETE.WINDOW_MS;
    throw new Error(`${ERROR_TYPES.RATE_LIMIT}:${waitTime}`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`${ERROR_TYPES.API_ERROR}:${errorData.error || `Failed to process ${endpoint}`}`);
  }

  return response;
};

export const getUserTweets = async (token, retryAttempt = 0) => {
  if (!token) {
    throw new Error(`${ERROR_TYPES.AUTH_ERROR}:No token provided`);
  }

  try {
    const response = await fetch('/api/twitter/tweets', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await handleApiResponse(response, 'tweets');
    return await response.json();

  } catch (error) {
    console.error('Error fetching tweets:', error);

    if (error.message.startsWith(ERROR_TYPES.RATE_LIMIT) && retryAttempt < RATE_LIMIT.DELETE.MAX_RETRIES) {
      const waitTime = calculateBackoff(retryAttempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return getUserTweets(token, retryAttempt + 1);
    }

    if (!navigator.onLine) {
      throw new Error(`${ERROR_TYPES.NETWORK_ERROR}:No internet connection`);
    }

    throw error;
  }
};

export const deleteTweet = async (tweetId, token, retryAttempt = 0) => {
  if (!token) {
    throw new Error(`${ERROR_TYPES.AUTH_ERROR}:No token provided`);
  }

  try {
    const response = await fetch(`/api/twitter/delete?tweetId=${tweetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await handleApiResponse(response, 'delete');
    return true;

  } catch (error) {
    console.error('Error deleting tweet:', error);

    if (error.message.startsWith(ERROR_TYPES.RATE_LIMIT) && retryAttempt < RATE_LIMIT.DELETE.MAX_RETRIES) {
      const [, waitTimeStr] = error.message.split(':');
      const waitTime = parseInt(waitTimeStr) || calculateBackoff(retryAttempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return deleteTweet(tweetId, token, retryAttempt + 1);
    }

    if (!navigator.onLine) {
      throw new Error(`${ERROR_TYPES.NETWORK_ERROR}:No internet connection`);
    }

    throw error;
  }
};

export const batchDeleteTweets = async (tweetIds, token, onProgress) => {
  const results = {
    success: 0,
    failed: 0,
    total: tweetIds.length,
    rateLimitHits: 0,
    errors: [] // Track specific errors for better error reporting
  };

  if (!token) {
    throw new Error(`${ERROR_TYPES.AUTH_ERROR}:No token provided`);
  }

  // Process tweets in chunks to respect rate limits
  const chunks = chunkArray(tweetIds, RATE_LIMIT.DELETE.REQUESTS_PER_WINDOW);
  let consecutiveFailures = 0;

  for (const chunk of chunks) {
    for (const tweetId of chunk) {
      try {
        await deleteTweet(tweetId, token);
        results.success++;
        consecutiveFailures = 0; // Reset consecutive failures on success
      } catch (error) {
        results.failed++;
        consecutiveFailures++;
        
        // Track specific error
        results.errors.push({
          tweetId,
          error: error.message,
          timestamp: new Date().toISOString()
        });

        if (error.message.startsWith(ERROR_TYPES.AUTH_ERROR)) {
          throw error;
        }
        
        if (error.message.startsWith(ERROR_TYPES.RATE_LIMIT)) {
          results.rateLimitHits++;
        }

        // If we have too many consecutive failures, pause for a longer time
        if (consecutiveFailures >= 3) {
          await new Promise(resolve => 
            setTimeout(resolve, RATE_LIMIT.DELETE.DELAY_MS * 5)
          );
          consecutiveFailures = 0; // Reset after waiting
        }
      }
      
      if (onProgress) {
        onProgress(results);
      }

      // Adaptive rate limiting delay based on success/failure ratio
      const delayMultiplier = results.rateLimitHits > 0 ? 2 : 1;
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT.DELETE.DELAY_MS * delayMultiplier)
      );
    }

    // Add a longer delay between chunks
    if (chunks.length > 1) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT.DELETE.DELAY_MS * 3)
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
