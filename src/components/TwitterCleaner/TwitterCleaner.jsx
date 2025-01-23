import React from 'react';
import { Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Twitter login logic will go here
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Twitter className="h-6 w-6 text-[var(--primary)]" />
                <h1 className="text-2xl font-bold text-[var(--foreground)]">
                  Twitter Account Cleaner
                </h1>
              </div>
              <p className="text-[#536471] text-base">
                Safely remove all your tweets and replies with just one click
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 bg-[#15202B] hover:bg-[#1a2834] text-white w-full px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <Twitter className="h-5 w-5" />
              Login with Twitter
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCleaner;
