import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, RefreshCw, LogOut, AlertCircle, WifiOff } from 'lucide-react';
import TwitterStats from './TwitterStats';
import DeleteOptions from './DeleteOptions';
import { getUserTweets, batchDeleteTweets } from '../../lib/twitter-api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [selection, setSelection] = useState({
    tweets: false,
    comments: false
  });
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState(null);

  const navigate = useNavigate();

  const stats = {
    tweets: tweets.filter(t => !t.referenced_tweets).length,
    comments: tweets.filter(t => t.referenced_tweets?.some(r => r.type === 'replied_to')).length
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('twitter_token');
    navigate('/');
  }, [navigate]);

  const loadTweets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('twitter_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await getUserTweets(token);
      setTweets(response.data || []);
    } catch (error) {
      console.error('Failed to load tweets:', error);
      setLastError(error);
      
      if (error.message.startsWith('auth_error') || error.message === 'Not authenticated') {
        handleLogout();
        return;
      }
      
      if (error.message.startsWith('network_error')) {
        setError('No internet connection. Please check your connection and try again.');
        return;
      }
      
      if (error.message.startsWith('rate_limit')) {
        setError('Rate limit reached. Please wait a moment and try again.');
        return;
      }

      setError('Failed to load your tweets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('twitter_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const tweetsToDelete = tweets.filter(tweet => {
        const isTweet = !tweet.referenced_tweets;
        const isComment = tweet.referenced_tweets?.some(r => r.type === 'replied_to');
        return (selection.tweets && isTweet) || (selection.comments && isComment);
      });

      await batchDeleteTweets(
        tweetsToDelete.map(t => t.id),
        token,
        ({ success, total }) => {
          setDeleteProgress(Math.round((success / total) * 100));
        }
      );

      await loadTweets();
    } catch (error) {
      console.error('Delete error:', error);
      setLastError(error);
      
      if (error.message.startsWith('auth_error')) {
        handleLogout();
        return;
      }
      
      if (error.message.startsWith('network_error')) {
        setError('No internet connection. Please check your connection and try again.');
        return;
      }
      
      if (error.message.startsWith('rate_limit')) {
        setError('Rate limit reached. Your progress has been saved. Please wait a moment.');
        return;
      }

      setError('Failed to delete items. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteProgress(0);
    }
  }, [tweets, selection, loadTweets, handleLogout]);

  const handleSelectionChange = useCallback((type, checked) => {
    setSelection(prev => ({
      ...prev,
      [type]: checked
    }));
  }, []);

  useEffect(() => {
    loadTweets();
  }, [loadTweets]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Twitter Cleaner</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadTweets}
                disabled={loading || isDeleting}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Refresh"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className={`rounded-lg border p-4 ${
              error.includes('Rate limit') ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {error.includes('internet') ? (
                  <WifiOff className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <p className="text-sm text-gray-700">{error}</p>
              </div>
              {lastError && lastError.message.startsWith('rate_limit') && (
                <button
                  onClick={() => {
                    setError(null);
                    setRetryCount(prev => prev + 1);
                    if (isDeleting) {
                      handleDelete();
                    } else {
                      loadTweets();
                    }
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Retry Now
                </button>
              )}
            </div>
          )}

          <TwitterStats 
            isLoading={loading}
            stats={stats}
            selection={selection}
            onSelectionChange={handleSelectionChange}
            hasError={!!error}
          />

          <DeleteOptions 
            isDeleting={isDeleting}
            progress={deleteProgress}
            selection={selection}
            onDelete={handleDelete}
            onLogout={handleLogout}
            disabled={!!error || loading}
            hasError={!!error}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
