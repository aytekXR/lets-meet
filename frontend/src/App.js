import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventGeneration from './pages/EventGeneration';
import EventDetails from './pages/EventDetails';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<EventGeneration />} />
          <Route path="/event/:eventCode" element={<EventDetails />} />
          <Route path="/confirmation/:eventCode" element={<Confirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 