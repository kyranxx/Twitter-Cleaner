import React, { useState } from 'react';
import { Twitter, Trash2, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    tweets: 1234,
    replies: 567
  });

  const handleDeleteTweets = () => {
    setLoading(true);
    // Delete tweets logic will go here
    setTimeout(() => setLoading(false), 1000);
  };

  const handleDeleteReplies = () => {
    setLoading(true);
    // Delete replies logic will go here
    setTimeout(() => setLoading(false), 1000);
  };

  const handleDeleteAll = () => {
    setLoading(true);
    // Delete all logic will go here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-[var(--primary)]" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Account Cleanup</h1>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-sm text-gray-600">Tweets</span>
                </div>
                <span className="text-lg font-semibold">{stats.tweets}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-sm text-gray-600">Replies</span>
                </div>
                <span className="text-lg font-semibold">{stats.replies}</span>
              </div>
            </div>
          </div>

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
                onClick={handleDeleteTweets}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Tweets
              </button>
              <button
                onClick={handleDeleteReplies}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Delete Replies
              </button>
            </div>
            <button
              onClick={handleDeleteAll}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
