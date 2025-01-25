// src/components/TwitterCleaner/TwitterCleaner.jsx
import React from 'react';
import { Twitter } from 'lucide-react';
import { generateTwitterAuthUrl } from '../../config/twitter';

const TwitterCleaner = () => {
  const handleLogin = async () => {
    try {
      const authUrl = generateTwitterAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initialize Twitter login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            <h1 className="text-xl font-bold text-[#0F1419]">Twitter Account Cleaner</h1>
          </div>
          <p className="text-[#536471] text-sm mb-6">
            Safely remove your tweets and replies with just one click
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-[#1DA1F2] text-white font-medium py-3 rounded-lg hover:bg-[#1a8cd8] transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Twitter className="h-4 w-4" />
              Login with Twitter
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
