// ... keep all the imports from before ...
import CleanerLogo from '../CleanerLogo';

const TwitterCleaner = () => {
  // ... keep all the state and functions ...

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CleanerLogo className="h-6 w-6 text-[var(--foreground)]" />
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
                  <p className="text-sm text-red-700">{error}</p>
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
