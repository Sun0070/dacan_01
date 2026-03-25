import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SearchModal from './components/SearchModal';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { seedIfNeeded } from './lib/seed';
import Camp from './pages/Camp';
import HackathonDetail from './pages/HackathonDetail';
import Hackathons from './pages/Hackathons';
import Home from './pages/Home';
import MyDashboard from './pages/MyDashboard';
import NotFound from './pages/NotFound';
import Rankings from './pages/Rankings';

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    seedIfNeeded();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/hackathons/:slug" element={<HackathonDetail />} />
          <Route path="/camp" element={<Camp />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/me" element={<MyDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
