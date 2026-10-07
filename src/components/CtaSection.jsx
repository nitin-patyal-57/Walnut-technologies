import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import Button from './ui/Button';

export default function CtaSection({
  eyebrow = 'Get Started',
  title = 'Ready to Build Your Next Product?',
  description = 'From concept to certification - we handle the entire manufacturing journey. ISO 13485 certified, 4 SMT lines, 500K+ units/month capacity.',
  showQuote = true,
}) {
  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-8 py-12 md:px-14 md:py-16 text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-cyan-400 font-bold text-[11px] uppercase tracking-widest mb-3 block">{eyebrow}</span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white leading-tight mb-4">{title}</h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8">{description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {showQuote && (
                <Button
                  variant="accent"
                  onClick={() => document.dispatchEvent(new Event('open-walnut-quote'))}
                >
                  Request a Quote
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghostLight" to="/contact">
                Contact Us
                <FiArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
