import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';

const TwitterCallback = () => {
  const [status, setStatus] = useState('Completing authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (!code) {
        setStatus('Authentication failed: No code received');
        return;
      }

      try {
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
          throw new Error('No code verifier found');
        }

        // Here you would typically make a request to your backend
        // to exchange the code for access token
        
        // For now, we'll just simulate success
        setStatus('Authentication successful!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('Authentication failed: ' + error.message);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-[#536471]">{status}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterCallback;
