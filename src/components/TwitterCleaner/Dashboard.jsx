import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, MessageSquare, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tweets: 1234,
    replies: 567
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('twitter_token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('codeVerifier');
    localStorage.removeItem('authState');
    navigate('/');
  };

  // ... keep existing functions (handleDeleteTweets, handleDeleteReplies, handleDeleteAll) ...

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
                onClick={() => window.location.reload()}
                className="text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Tweets</span>
                </div>
                <span className="text-lg font-semibold">{stats.tweets}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm text-gray-600">Replies</span>
                </div>
                <span className="text-lg font-semibold">{stats.replies}</span>
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
                disabled={deleting || loading}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Tweets
              </button>
              <button
                onClick={handleDeleteReplies}
                disabled={deleting || loading}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Replies
              </button>
            </div>
            <button
              onClick={() => handleDeleteTweets(true)}
              disabled={deleting || loading}
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
