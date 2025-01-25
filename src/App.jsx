import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TwitterCleaner from './components/TwitterCleaner/TwitterCleaner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TwitterCleaner />} />
        <Route path="/callback" element={<TwitterCleaner />} />
      </Routes>
    </Router>
  );
}

export default App;
