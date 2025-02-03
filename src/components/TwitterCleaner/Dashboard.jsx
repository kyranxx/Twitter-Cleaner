import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, RefreshCw, LogOut, AlertCircle, WifiOff } from 'lucide-react';
import CleanerLogo from '../CleanerLogo';
import TwitterStats from './TwitterStats';
import DeleteOptions from './DeleteOptions';
import { getUserTweets, batchDeleteTweets } from '../../lib/twitter-api';

const Alert = ({ children, variant = 'default', className = '', ...props }) => (
  <div
    className={`rounded-lg border p-4 ${
      variant === 'destructive' ? 'border-red-200 bg-red-50' :
      variant === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
    {children}
  </div>
);

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

  if (loading && !tweets.length) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-[var(--foreground)]">Loading your Twitter data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CleanerLogo className="h-6 w-6 text-[var(--foreground)]" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                Account Cleanup
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadTweets}
                disabled={loading || isDeleting}
                className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <Alert variant={error.includes('Rate limit') ? 'warning' : 'destructive'}>
              {error.includes('internet') ? (
                <WifiOff className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {error}
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
                    className="ml-2 text-sm underline hover:no-underline"
                  >
                    Retry Now
                  </button>
                )}
              </AlertDescription>
            </Alert>
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
      </div>
    </div>
  );
};

export default Dashboard;
