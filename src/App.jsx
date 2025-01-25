import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';
import Dashboard from './components/TwitterCleaner/Dashboard';

// Add future flags for React Router v7
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router {...router}>
      <Routes>
        <Route path="/" element={<TwitterCleaner />} />
        <Route path="/callback" element={<TwitterCleaner />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
