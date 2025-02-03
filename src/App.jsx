import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';
import Dashboard from './components/TwitterCleaner/Dashboard';
import TwitterCallback from './components/TwitterCallback/TwitterCallback';
import ErrorBoundary from './components/ErrorBoundary';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('twitter_token');
  if (!token) {
    // Clear any stale data
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('twitter_cleaner_v2_oauth_state');
    localStorage.removeItem('twitter_cleaner_v2_token');
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-[var(--background)]">
          <Routes>
            <Route path="/" element={<TwitterCleaner />} />
            <Route path="/callback" element={<TwitterCallback />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
