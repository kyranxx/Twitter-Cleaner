import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateOAuthState, getStoredCodeVerifier, storeToken, TWITTER_CONFIG } from '../../config/twitter';

const Card = ({ className = '', ...props }) => (
  <div className={`bg-white rounded-xl border shadow-sm ${className}`} {...props} />
);

const Alert = ({ children, variant = 'default', className = '', ...props }) => (
  <div
    className={`rounded-lg border p-4 ${
      variant === 'destructive' ? 'border-red-200 bg-red-50 text-red-800' : 
      variant === 'success' ? 'border-green-200 bg-green-50 text-green-800' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

const TwitterCallback = () => {
  const [status, setStatus] = useState('Verifying authentication...');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        if (error) {
          throw new Error(
            error === 'access_denied' 
              ? 'Access was denied. Please try again.'
              : `Authentication failed: ${error}`
          );
        }

        if (!code || !state) {
          throw new Error('Invalid callback parameters');
        }

        // Validate OAuth state
        if (!validateOAuthState(state)) {
          throw new Error('Invalid state parameter. Please try logging in again.');
        }

        // Get stored code verifier
        const codeVerifier = getStoredCodeVerifier();
        if (!codeVerifier) {
          throw new Error('Missing authentication data. Please try logging in again.');
        }

        setStatus('Exchanging authentication code...');

        // Exchange code for token
        const response = await fetch(TWITTER_CONFIG.tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: TWITTER_CONFIG.redirectUri,
            code_verifier: codeVerifier,
            client_id: TWITTER_CONFIG.clientId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Token exchange error:', errorData);
          throw new Error(
            errorData.error_description || 
            errorData.error || 
            `Failed to authenticate (${response.status})`
          );
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
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        {error ? (
          <Alert variant="destructive" className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Authentication Failed</h3>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-2">Redirecting you back...</p>
            </div>
          </Alert>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
                <p className="text-center text-gray-600">{status}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <p className="text-center text-gray-600">{status}</p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TwitterCallback;
