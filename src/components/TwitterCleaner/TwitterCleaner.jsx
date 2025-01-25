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
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-[var(--primary)]" />
            <h1 className="text-xl font-bold text-[var(--foreground)]">Twitter Account Cleaner</h1>
          </div>
          <p className="text-[#536471] text-sm">
            Safely remove all your tweets and replies with just one click
          </p>
          <button
            onClick={handleLogin}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0F1419] hover:bg-[#272C30] text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <Twitter className="h-4 w-4" />
            Login with Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
