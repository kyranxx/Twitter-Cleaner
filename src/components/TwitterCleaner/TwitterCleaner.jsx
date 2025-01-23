import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Twitter login logic will go here
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] p-4 flex items-center justify-center">
      <div 
        style={{ maxWidth: '440px' }}
        className="w-full bg-white rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Twitter 
                  size={24}
                  className="text-[#1DA1F2] flex-shrink-0" 
                />
                <h1 className="text-[22px] leading-7 font-bold text-[#0F1419]">
                  Twitter Account Cleaner
                </h1>
              </div>
              <p className="text-[15px] leading-5 text-[#536471]">
                Safely remove all your tweets and replies with just one click
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-[#0F1419] text-white rounded-lg px-4 py-3 font-semibold hover:bg-[#272C30] transition-colors"
            >
              <Twitter size={20} className="flex-shrink-0" />
              <span>Login with Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
