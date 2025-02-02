import { useState } from 'react';
import { generateTwitterAuthUrl, clearOAuthData } from '../../config/twitter';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      clearOAuthData();
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
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Twitter Cleaner</h1>
          <p className="text-gray-600">
            Easily manage and delete your old tweets, retweets, and likes
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            {/* Main Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white rounded-full py-2.5 px-4 font-semibold
                         hover:bg-[var(--primary)]/90 transition-colors relative
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                  Connecting...
                </div>
              ) : (
                'Connect with Twitter'
              )}
            </button>
          </div>

          {/* Features List */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Features:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Bulk delete tweets and comments
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Filter by date and type
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Secure and private
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
