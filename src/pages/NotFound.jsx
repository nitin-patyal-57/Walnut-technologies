import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <SEO title="Page Not Found" description="The page you're looking for does not exist." path="/404" noindex />
      <div className="text-center px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-display text-slate-900 mb-4">404</h1>
        <p className="text-base sm:text-lg text-slate-500 mb-6">Page not found</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">
            Go Home
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-slate-400 transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
