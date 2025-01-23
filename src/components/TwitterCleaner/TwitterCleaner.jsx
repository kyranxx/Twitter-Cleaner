import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Twitter login logic will go here
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow">
        <div className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <h1 className="text-[22px] font-bold text-[#0F1419]">
                  Twitter Account Cleaner
                </h1>
              </div>
              <p className="text-[#536471] text-[15px]">
                Safely remove all your tweets and replies with just one click
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#0F1419] hover:bg-gray-900 text-white rounded-lg py-3 px-4 font-medium transition-colors"
            >
              <Twitter className="h-5 w-5" />
              Login with Twitter
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TwitterCleaner;
