export const TWITTER_CONFIG = {
    CLIENT_ID: import.meta.env.VITE_TWITTER_CLIENT_ID,
    REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
    SCOPE: ['tweet.read', 'tweet.write', 'users.read'].join(' '),
};
