import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Twitter, AlertCircle } from 'lucide-react';
import { useTwitterAuth } from '../../hooks/useTwitterAuth';
import TwitterStats from './TwitterStats';
import DeleteOptions from './DeleteOptions';

const TwitterCleaner = () => {
  const { 
    isAuthenticated, 
    error,
    handleLogin, 
    handleLogout 
  } = useTwitterAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="w-6 h-6" />
            Twitter Account Cleaner
          </CardTitle>
          <CardDescription>
            Safely remove your tweets and replies with just one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAuthenticated ? (
            <Button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Login with Twitter
            </Button>
          ) : (
            <>
              <TwitterStats />
              <DeleteOptions onLogout={handleLogout} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCleaner;
