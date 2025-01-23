import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Twitter className="h-6 w-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                Twitter Account Cleaner
              </h1>
            </div>
            <p className="text-gray-600 text-base">
              Safely remove all your tweets and replies with just one click
            </p>
          </div>

          <button
            onClick={() => {}}
            className="w-full bg-gray-900 text-white rounded-lg py-3 px-4 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-800"
          >
            <Twitter className="h-5 w-5" />
            <span>Login with Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCleaner;
