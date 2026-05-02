import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import Features from './components/Features';
import Pipeline from './components/Pipeline';
import ValueProposition from './components/ValueProposition';
import UseCases from './components/UseCases';
import Dashboard from './components/Dashboard';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CrisisAlert from './components/CrisisAlert';
import { getCrisis } from './api';
import Toaster from './components/Toaster';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [globalCrisis, setGlobalCrisis] = useState(null);

  // Poll for crisis status globally every 30 seconds so the banner works everywhere
  useEffect(() => {
    const fetchCrisis = async () => {
      try {
        const data = await getCrisis();
        setGlobalCrisis(data);
      } catch (err) {
        // Ignore errors for the global poll to avoid spamming the console if backend is down
      }
    };

    fetchCrisis();
    const interval = setInterval(fetchCrisis, 30000);
    return () => clearInterval(interval);
  }, []);

  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleHeroPostCreated = () => {
    setRefreshCounter(c => c + 1);
  };

  return (
    <div className="bg-dark-900 min-h-screen text-white font-sans selection:bg-primary/30 selection:text-white">
      <CrisisAlert crisis={globalCrisis} />
      <Navbar />
      <Toaster />
      <main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard externalRefreshCounter={refreshCounter} />} />
          <Route path="/" element={
            <>
              <Hero onPostCreated={handleHeroPostCreated} />
              <TrustBar />
              <Features />
              <Pipeline />
              <ValueProposition />
              <UseCases />
              <Dashboard externalRefreshCounter={refreshCounter} />
              <CTA />
            </>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
