import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiLayers, FiSettings, FiUser, FiMessageCircle } from 'react-icons/fi';

const bottomNavItems = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Solutions', to: '/solutions', icon: FiLayers },
  { label: 'Career', to: '/career', icon: FiSettings },
  { label: 'About', to: '/about', icon: FiUser },
  { label: 'Contact', to: '/contact', icon: FiMessageCircle },
];

export default function MobileBottomNav({ onOpenQuote }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background blur */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" />
      
      {/* Nav items */}
      <nav className="relative flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              aria-label={item.label}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative"
            >
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className={`p-1.5 rounded-xl transition-all ${
                active 
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold transition-all ${
                active ? 'text-cyan-600' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* Quick Action Button */}
        <button
          onClick={onOpenQuote}
          aria-label="Request Quote"
          className="flex flex-col items-center gap-0.5 py-1 px-3"
        >
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30">
            <FiMessageCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-emerald-600">Quote</span>
        </button>
      </nav>
    </div>
  );
}
