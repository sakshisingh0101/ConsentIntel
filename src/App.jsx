import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import RiskPreview from './pages/RiskPreview';
import Dashboard from './pages/Dashboard';
import TimelinePage from './pages/TimelinePage';
import RiskExplanation from './pages/RiskExplanation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/preview" element={<RiskPreview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timeline/:appId" element={<TimelinePage />} />
            <Route path="/explain/:appId" element={<RiskExplanation />} />
          </Routes>
        </main>
        <footer className="border-t py-6 text-center text-muted-foreground text-sm">
          Consent Intelligence Dashboard (POC) - Hackathon Demo
        </footer>
      </div>
    </Router>
  );
}

export default App;
