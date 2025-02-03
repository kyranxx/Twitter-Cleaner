import React, { useState } from 'react';
import { generateTwitterAuthUrl } from '../../config/twitter';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUrl = await generateTwitterAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initialize login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)] text-white mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Twitter Cleaner</h1>
          <p className="text-gray-600 max-w-sm mx-auto">
            Easily manage and delete your old tweets, retweets, and likes
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white rounded-full py-3 px-4 font-semibold
                     hover:bg-[var(--primary)]/90 transition-colors relative
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
                <span>Connect with Twitter</span>
              </>
            )}
          </button>

          {/* Features List */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Features:</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Bulk delete tweets and comments</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Filter by date and type</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure and private</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default TwitterCleaner;
