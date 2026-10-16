import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import ScheduleCallModal from './components/ScheduleCallModal';
import WhatsAppButton from './components/WhatsAppButton';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import SEO from './components/SEO';
import { scrollBehavior } from './utils/motion';

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
const EvolutionDetailPage = lazy(() => import('./pages/EvolutionDetailPage'));
const FutureDetailPage = lazy(() => import('./pages/FutureDetailPage'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return <PageSkeleton />;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: scrollBehavior() });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    }
  }, [pathname, hash]);
  return null;
}

function AppContent() {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Navbar
        onOpenSchedule={() => setScheduleModalOpen(true)}
      />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<ErrorBoundary isPageLevel><HomePage onOpenSchedule={() => setScheduleModalOpen(true)} /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary isPageLevel><AboutPage /></ErrorBoundary>} />
          <Route path="/about/evolution/:slug" element={<ErrorBoundary isPageLevel><EvolutionDetailPage /></ErrorBoundary>} />
          <Route path="/about/future/:slug" element={<ErrorBoundary isPageLevel><FutureDetailPage /></ErrorBoundary>} />
          <Route path="/solutions" element={<ErrorBoundary isPageLevel><SolutionsPage /></ErrorBoundary>} />
          <Route path="/process" element={<ErrorBoundary isPageLevel><ProcessPage /></ErrorBoundary>} />
          <Route path="/expertise" element={<ErrorBoundary isPageLevel><ExpertisePage /></ErrorBoundary>} />
          <Route path="/expertise/:slug" element={<ErrorBoundary isPageLevel><ExpertiseDetailPage /></ErrorBoundary>} />
          <Route path="/clients" element={<ErrorBoundary isPageLevel><ClientsPage /></ErrorBoundary>} />
          <Route path="/resources" element={<ErrorBoundary isPageLevel><ResourcesPage /></ErrorBoundary>} />
          <Route path="/news" element={<ErrorBoundary isPageLevel><NewsPage /></ErrorBoundary>} />
          <Route path="/contact" element={<ErrorBoundary isPageLevel><ContactPage /></ErrorBoundary>} />
          <Route path="/career" element={<ErrorBoundary isPageLevel><CareerPage /></ErrorBoundary>} />
          <Route path="/apply" element={<ErrorBoundary isPageLevel><JobApplicationPage /></ErrorBoundary>} />
          <Route path="/privacy" element={<ErrorBoundary isPageLevel><PrivacyPage /></ErrorBoundary>} />
          <Route path="/terms" element={<ErrorBoundary isPageLevel><TermsPage /></ErrorBoundary>} />
          {/* Pages created in the admin panel. /p/ is reserved for them, so
              these can never shadow a real route above. */}
          <Route path="/p/:slug" element={<ErrorBoundary isPageLevel><DynamicPage /></ErrorBoundary>} />
          <Route path="*" element={<ErrorBoundary isPageLevel><NotFound /></ErrorBoundary>} />
        </Routes>
      </Suspense>
      </main>

      <Footer />

      <ScheduleCallModal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} />
      <Suspense fallback={null}>
        <ChatWidget onChatStateChange={setIsChatOpen} />
        <WhatsAppButton isChatOpen={isChatOpen} />
        <InstallPrompt />
      </Suspense>
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
