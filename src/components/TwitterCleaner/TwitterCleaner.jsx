import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import XLogo from '../XLogo';
import { Loader2, AlertCircle } from 'lucide-react';

const TWITTER_AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://twitter-cleaner-2.vercel.app/callback';

const TwitterCleaner = () => {
  // ... keep all the previous state and functions ...

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <XLogo className="h-5 w-5" />
              <h1 className="text-xl font-bold text-[var(--foreground)]">Account Cleaner</h1>
            </div>
            <p className="text-[#536471] text-sm">
              Safely remove your posts and replies with just one click
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-red-800">Authentication Failed</h3>
                  <p className="text-sm text-red-700">
                    {error === 'access_denied' 
                      ? 'Access was denied. Please try signing in again.'
                      : error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Sign in
                <XLogo className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
