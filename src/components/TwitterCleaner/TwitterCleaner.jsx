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
    <div className="min-h-screen bg-[#F7F9F9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <h1 className="text-xl font-bold text-[#0F1419]">Twitter Account Cleaner</h1>
              </div>
              <p className="text-[#536471] text-base">
                Safely remove all your tweets and replies with just one click
              </p>
            </div>

            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 bg-[#15202B] hover:bg-[#0D1117] text-white px-4 py-3 rounded-md font-medium transition-colors w-full"
              >
                <Twitter className="h-5 w-5" />
                Login with Twitter
              </button>
            ) : isLoading ? (
              <div className="flex flex-col gap-4">
                <div className="bg-[#FEE2E2] text-[#991B1B] p-4 rounded-md">
                  <p className="font-medium mb-1">Warning</p>
                  <p>This action will permanently delete all your tweets and replies. This cannot be undone.</p>
                </div>
                <div className="bg-[#F9A8B4] text-white p-3 rounded-md flex items-center justify-center">
                  <span className="animate-pulse">Deleting... {progress}%</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-[#FEE2E2] text-[#991B1B] p-4 rounded-md">
                  <p className="font-medium mb-1">Warning</p>
                  <p>This action will permanently delete all your tweets and replies. This cannot be undone.</p>
                </div>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 bg-[#F04444] hover:bg-[#DC3545] text-white px-4 py-3 rounded-md font-medium transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete All Tweets
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCleaner;
