import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Twitter login logic will go here
  };

  return (
    <div className="min-h-screen bg-[#f7f9f9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center justify-center">
            <Twitter className="w-8 h-8 text-[#1DA1F2]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Twitter Account Cleaner
            </h1>
            <p className="text-gray-600">
              Safely remove your tweets and replies with just one click
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full py-2.5 px-4 flex items-center justify-center space-x-2 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Login with Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
