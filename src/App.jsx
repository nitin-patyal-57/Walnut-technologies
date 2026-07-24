import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import ScheduleCallModal from './components/ScheduleCallModal';
import ChatWidget from './components/ChatWidget';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';

const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const ExpertisePage = lazy(() => import('./pages/ExpertisePage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-dark-300 border-t-dark-950 rounded-full animate-spin" />
        <p className="text-sm text-dark-500">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);
  return null;
}

function AppContent() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navbar
        onOpenQuote={() => setQuoteModalOpen(true)}
        onOpenSchedule={() => setScheduleModalOpen(true)}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage onOpenQuote={() => setQuoteModalOpen(true)} onOpenSchedule={() => setScheduleModalOpen(true)} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionsPage onOpenQuote={() => setQuoteModalOpen(true)} />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage onOpenQuote={() => setQuoteModalOpen(true)} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Suspense>

      <Footer />

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
      <ScheduleCallModal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} />
      <ChatWidget onOpenQuote={() => setQuoteModalOpen(true)} />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <AppContent />
    </BrowserRouter>
  );
}
