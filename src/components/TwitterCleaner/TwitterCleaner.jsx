import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Login logic will be implemented later
  };

  return (
    <div className="min-h-screen bg-[#f7f9f9] flex items-center justify-center px-4 py-12 font-['Inter']">
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-[0_0_10px_rgba(0,0,0,0.05)] p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2]/10">
              <Twitter className="w-6 h-6 text-[#1DA1F2]" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#0F1419]">
                Twitter Account Cleaner
              </h1>
              <p className="text-[15px] text-[#536471] mt-1">
                Safely remove your tweets and replies with just one click
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] transition-colors text-white font-semibold rounded-full px-4 py-3 flex items-center justify-center gap-2 text-[15px]"
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
