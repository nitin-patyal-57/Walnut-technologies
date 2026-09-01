import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brand } from '../data/content';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15;
        const next = Math.min(prev + increment, 90);
        return next;
      });
    }, 300);

    const dismiss = () => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = 'unset';
      }, 600);
    };

    const forceDismiss = setTimeout(dismiss, 3000);

    if (document.readyState === 'complete') {
      setTimeout(dismiss, 800);
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }

    return () => {
      clearTimeout(forceDismiss);
      clearInterval(progressInterval);
      window.removeEventListener('load', dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Background glow */}
            <div className="absolute w-64 h-64 bg-dark-400/20 rounded-full blur-[80px] animate-pulse-glow" />

            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 mb-2"
            >
              <motion.img
                src="/walnut-logo/walnut_technologies_logo.svg"
                alt="Walnut Technologies"
                className="w-64 h-auto object-contain"
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    'brightness(1) drop-shadow(0 0 0px rgba(12,142,231,0))',
                    'brightness(1.1) drop-shadow(0 0 20px rgba(12,142,231,0.3))',
                    'brightness(1) drop-shadow(0 0 0px rgba(12,142,231,0))',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center z-10"
            >
              <h1 className="text-2xl font-bold font-display text-dark-950 mb-1">
                {brand.name}
              </h1>
              <p className="text-sm text-dark-500 font-medium tracking-wider uppercase">
                {brand.tagline}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 w-48 z-10"
            >
              <div className="h-1 bg-dark-800/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-dark-500 text-center mt-2 font-mono">
                {Math.round(progress)}%
              </p>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-1.5 mt-4 z-10"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
