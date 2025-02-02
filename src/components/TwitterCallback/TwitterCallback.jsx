import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { validateOAuthState, getStoredCodeVerifier, storeToken } from '../../config/twitter';

const TwitterCallback = () => {
  const [status, setStatus] = useState('Verifying authentication...');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      
      try {
        if (error) {
          throw new Error(
            error === 'access_denied' 
              ? 'Access was denied. Please try again.'
              : 'Authentication failed. Please try again.'
          );
        }

        if (!code || !state) {
          throw new Error('Invalid callback parameters');
        }

        // Validate OAuth state
        const isValidState = await validateOAuthState(state);
        if (!isValidState) {
          throw new Error('Invalid state parameter. Please try logging in again.');
        }

        // Get stored code verifier
        const codeVerifier = await getStoredCodeVerifier();
        if (!codeVerifier) {
          throw new Error('Missing authentication data. Please try logging in again.');
        }

        setStatus('Exchanging authentication code...');

        // Exchange code for token
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            redirect_uri: window.location.origin + '/callback'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const tokenData = await response.json();
        
        setStatus('Securing your session...');
        await storeToken(tokenData);

        setStatus('Authentication successful!');
        setIsLoading(false);

        // Redirect after a brief delay to show success message
        setTimeout(() => navigate('/dashboard'), 1500);

      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message);
        setIsLoading(false);

        // Redirect to home after showing error
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-[#536471]">{status}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <p className="text-center text-[#536471]">{status}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCallback;
