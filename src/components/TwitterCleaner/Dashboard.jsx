import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, MessageSquare, RefreshCw, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserTweets } from '../../lib/twitter-api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    tweets: 0,
    replies: 0
  });

  const loadTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('twitter_token');
      
      if (!token) {
        navigate('/');
        return;
      }

      const data = await getUserTweets(token);
      
      // Separate tweets and replies
      const tweetStats = data.data.reduce((acc, tweet) => {
        if (tweet.referenced_tweets?.some(ref => ref.type === 'replied_to')) {
          acc.replies++;
        } else {
          acc.tweets++;
        }
        return acc;
      }, { tweets: 0, replies: 0 });

      setStats(tweetStats);
    } catch (error) {
      console.error('Failed to load tweets:', error);
      setError('Failed to load tweets. Please try again.');
      if (error.message.includes('401')) {
        // Token expired
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Load tweets on mount
  useEffect(() => {
    loadTweets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('codeVerifier');
    localStorage.removeItem('authState');
    navigate('/');
  };

  const handleDeleteTweets = async (includeReplies = false) => {
    try {
      setDeleting(true);
      // Delete implementation will go here
      console.log('Deleting tweets, includeReplies:', includeReplies);
    } catch (error) {
      console.error('Failed to delete tweets:', error);
    } finally {
      setDeleting(false);
      setProgress(null);
    }
  };

  const handleDeleteReplies = async () => {
    try {
      setDeleting(true);
      // Delete replies implementation will go here
      console.log('Deleting replies');
    } catch (error) {
      console.error('Failed to delete replies:', error);
    } finally {
      setDeleting(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Logout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Account Cleanup</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadTweets}
                disabled={loading}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Tweets</span>
                </div>
                <span className="text-lg font-semibold">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : stats.tweets}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Replies</span>
                </div>
                <span className="text-lg font-semibold">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : stats.replies}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {progress && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Deleting...</span>
                  <span className="text-sm font-medium text-blue-600">
                    {progress.success} / {progress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.success / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-yellow-800">Warning</h3>
                <p className="text-sm text-yellow-700">
                  This action is irreversible. Once deleted, your tweets and replies cannot be recovered. 
                  Make sure you want to proceed before clicking delete.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleDeleteTweets(false)}
                disabled={deleting || loading || stats.tweets === 0}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Tweets
              </button>
              <button
                onClick={handleDeleteReplies}
                disabled={deleting || loading || stats.replies === 0}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Replies
              </button>
            </div>
            <button
              onClick={() => handleDeleteTweets(true)}
              disabled={deleting || loading || (stats.tweets === 0 && stats.replies === 0)}
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Delete Everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
