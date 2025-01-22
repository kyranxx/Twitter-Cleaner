import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Twitter } from 'lucide-react';

const TwitterCleaner = () => {
  const handleLogin = () => {
    // Twitter login logic will go here
  };

  return (
    <div className="min-h-screen bg-[#f7f9f9] p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Twitter className="w-6 h-6 text-[#1DA1F2]" />
            <CardTitle className="text-xl font-semibold">
              Twitter Account Cleaner
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Safely remove your tweets and replies with just one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogin}
            className="w-full bg-[#15202b] hover:bg-[#0d1117] text-white py-6"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Login with Twitter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCleaner;
