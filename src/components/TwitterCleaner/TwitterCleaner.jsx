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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'white' }}>
      <div className="w-full max-w-md p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Twitter className="h-6 w-6 text-[#1DA1F2]" />
            <h1 className="text-xl font-semibold text-[#0F1419]">Twitter Account Cleaner</h1>
          </div>
          <p className="text-[#536471] text-sm mb-4">
            Safely remove your tweets and replies with just one click
          </p>
          <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            <Twitter className="h-5 w-5" />
            Login with Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
