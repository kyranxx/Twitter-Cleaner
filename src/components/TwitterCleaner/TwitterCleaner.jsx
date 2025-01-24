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
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-[var(--primary)]" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Twitter Account Cleaner</h1>
            </div>
            <p className="text-[#536471] text-sm">
              Safely remove your tweets and replies with just one click
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md font-medium transition-colors"
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
