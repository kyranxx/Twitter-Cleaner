import React, { useState } from 'react';
import { Twitter, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TwitterCleaner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLogin = () => {
    // Twitter login logic will go here
  };

  const handleDelete = () => {
    setIsLoading(true);
    // Simulated progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Twitter className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">Twitter Account Cleaner</h1>
            </div>
            <p className="text-[#536471] text-base">
              Safely remove all your tweets and replies with just one click
            </p>
          </div>

          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#15202B] hover:bg-[#1E2732] text-white px-4 py-3 rounded-xl font-medium transition-colors text-base disabled:opacity-50"
            >
              <Twitter className="h-5 w-5" />
              Login with Twitter
            </button>
          ) : (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-colors text-base disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
              Delete All Tweets
            </button>
          )}

          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#15202B] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
