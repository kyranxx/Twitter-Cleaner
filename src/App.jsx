import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';
import Dashboard from './components/TwitterCleaner/Dashboard';
import TwitterCallback from './components/TwitterCallback/TwitterCallback';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('twitter_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
