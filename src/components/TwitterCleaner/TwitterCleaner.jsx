import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TWITTER_CONFIG, generateTwitterAuthUrl, validateOAuthState, getStoredCodeVerifier, clearOAuthData } from '../../config/twitter';
import LoadingButton from '../../components/LoadingButton/LoadingButton'; // Corrected import path
import { Container } from './TwitterCleaner.styles';

const TwitterCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');

    if (code) {
      const verifier = getStoredCodeVerifier();
      
      if (!verifier) {
        setError('Missing authentication data. Please try logging in again.');
        return;
      }

      if (!validateOAuthState(state)) {
        setError('Invalid state parameter. Please try logging in again.');
        return;
      }

      setLoading(true);

      fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: verifier,
          redirect_uri: TWITTER_CONFIG.redirectUri,
        }),
      })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        localStorage.setItem('twitter_token', data.access_token);
        clearOAuthData();
        navigate('/dashboard');
      })
      .catch(err => {
        console.error('Token exchange error:', err);
        setError('Authentication failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (error) {
      setError(error === 'access_denied' 
        ? 'Access was denied. Please try again.' 
        : 'Authentication failed. Please try again.');
    }
  }, [location, navigate]);

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
    <Container>
      <h1>Twitter Cleaner</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <LoadingButton
        onClick={handleLogin}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect with Twitter'}
      </LoadingButton>
    </Container>
  );
};

export default TwitterCleaner;
