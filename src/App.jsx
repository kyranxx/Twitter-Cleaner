import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';
import Dashboard from './components/TwitterCleaner/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TwitterCleaner />} />
        <Route path="/callback" element={<TwitterCleaner />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
