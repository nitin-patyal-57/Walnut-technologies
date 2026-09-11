import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import ScheduleCallModal from './components/ScheduleCallModal';
import WhatsAppButton from './components/WhatsAppButton';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';

const ChatWidget = lazy(() => import('./components/ChatWidget'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));

import { PageSkeleton } from './components/Skeleton';

const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const ExpertisePage = lazy(() => import('./pages/ExpertisePage'));
const ExpertiseDetailPage = lazy(() => import('./pages/ExpertiseDetailPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CareerPage = lazy(() => import('./pages/CareerPage'));
const JobApplicationPage = lazy(() => import('./pages/JobApplicationPage'));

function PageLoader() {
  return <PageSkeleton />;
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
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Navbar
        onOpenQuote={() => setQuoteModalOpen(true)}
        onOpenSchedule={() => setScheduleModalOpen(true)}
      />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<ErrorBoundary isPageLevel><HomePage onOpenQuote={() => setQuoteModalOpen(true)} onOpenSchedule={() => setScheduleModalOpen(true)} /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary isPageLevel><AboutPage /></ErrorBoundary>} />
          <Route path="/solutions" element={<ErrorBoundary isPageLevel><SolutionsPage onOpenQuote={() => setQuoteModalOpen(true)} /></ErrorBoundary>} />
          <Route path="/process" element={<ErrorBoundary isPageLevel><ProcessPage /></ErrorBoundary>} />
          <Route path="/expertise" element={<ErrorBoundary isPageLevel><ExpertisePage /></ErrorBoundary>} />
          <Route path="/expertise/:slug" element={<ErrorBoundary isPageLevel><ExpertiseDetailPage /></ErrorBoundary>} />
          <Route path="/clients" element={<ErrorBoundary isPageLevel><ClientsPage /></ErrorBoundary>} />
          <Route path="/resources" element={<ErrorBoundary isPageLevel><ResourcesPage /></ErrorBoundary>} />
          <Route path="/news" element={<ErrorBoundary isPageLevel><NewsPage /></ErrorBoundary>} />
          <Route path="/contact" element={<ErrorBoundary isPageLevel><ContactPage onOpenQuote={() => setQuoteModalOpen(true)} /></ErrorBoundary>} />
          <Route path="/career" element={<ErrorBoundary isPageLevel><CareerPage /></ErrorBoundary>} />
          <Route path="/apply" element={<ErrorBoundary isPageLevel><JobApplicationPage /></ErrorBoundary>} />
          <Route path="/privacy" element={<ErrorBoundary isPageLevel><PrivacyPage /></ErrorBoundary>} />
          <Route path="/terms" element={<ErrorBoundary isPageLevel><TermsPage /></ErrorBoundary>} />
          <Route           path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="text-center px-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-display text-slate-900 mb-4">404</h1>
                <p className="text-base sm:text-lg text-slate-500 mb-6">Page not found</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">
                  Go Home
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
      </main>

      <Footer />

      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
      <ScheduleCallModal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} />
      <Suspense fallback={null}>
        <ChatWidget onOpenQuote={() => setQuoteModalOpen(true)} onChatStateChange={setIsChatOpen} />
        <WhatsAppButton isChatOpen={isChatOpen} />
        <InstallPrompt />
      </Suspense>
      <MobileBottomNav onOpenQuote={() => setQuoteModalOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <LanguageProvider>
            <Preloader />
            <AppContent />
          </LanguageProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
