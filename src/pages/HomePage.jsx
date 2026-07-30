import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiShield, FiGlobe, FiArrowUpRight } from 'react-icons/fi';
import Hero from '../components/Hero';

const divisions = [
  {
    id: 'medical',
    title: 'Medical Devices',
    subtitle: 'ISO 13485, Class 10K Cleanroom',
    description: 'Life-critical medical electronics with full regulatory compliance.',
    color: 'from-cyan-500 to-blue-600',
    icon: FiHeart,
    link: '/solutions?category=Medical+Devices',
  },
  {
    id: 'neuro',
    title: 'Neuro Rehab Devices',
    subtitle: 'FDA, IEC 60601 Compliant',
    description: 'Advanced rehabilitation technology for neurological recovery.',
    color: 'from-violet-500 to-purple-600',
    icon: FiCpu,
    link: '/solutions?category=Medical+Devices',
  },
  {
    id: 'payment',
    title: 'Payment Systems',
    subtitle: 'PCI-DSS, NPCI, RBI Certified',
    description: 'Secure payment terminal manufacturing with end-to-end compliance.',
    color: 'from-emerald-500 to-green-600',
    icon: FiCreditCard,
    link: '/solutions?category=Payment+Systems',
  },
  {
    id: 'automotive',
    title: 'Automotive Electronics',
    subtitle: 'IATF 16949 Compliant',
    description: 'High-reliability electronics for automotive applications.',
    color: 'from-amber-500 to-orange-600',
    icon: FiCpu,
    link: '/solutions?category=Custom+Electronics',
  },
  {
    id: 'iot',
    title: 'IoT Solutions',
    subtitle: 'End-to-End Connectivity',
    description: 'Smart connected devices for industrial and consumer applications.',
    color: 'from-rose-500 to-pink-600',
    icon: FiGlobe,
    link: '/solutions?category=Custom+Electronics',
  },
  {
    id: 'custom',
    title: 'Custom Solutions',
    subtitle: '4 SMT Lines, 300K+ Units/Month',
    description: 'Full-spectrum OEM/ODM services from concept to delivery.',
    color: 'from-slate-700 to-slate-900',
    icon: FiCpu,
    link: '/solutions?category=Custom+Electronics',
  },
];

const whyChooseUs = [
  { icon: FiShield, title: 'ISO 13485 Certified', desc: 'Quality management for medical devices' },
  { icon: FiGlobe, title: '20+ Countries', desc: 'Global supply chain and logistics' },
  { icon: FiCheckCircle, title: '99.8% Yield Rate', desc: 'Industry-leading manufacturing precision' },
];

function DivisionsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="divisions-preview" className="py-16 md:py-20 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Our Verticals
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Six Divisions,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 font-black">
              One Standard
            </span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Specialized manufacturing verticals serving the most demanding industries.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {divisions.map((div, index) => {
            const Icon = div.icon;
            return (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={div.link}
                  className="group block relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-transparent hover:shadow-xl transition-all duration-500"
                >
                  {/* Gradient Header */}
                  <div className={`relative h-28 bg-gradient-to-br ${div.color} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    <Icon className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform duration-500" />
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {div.title}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-600 mb-2">{div.subtitle}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{div.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      Explore Solutions
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="cta-section" className="py-16 md:py-20 bg-slate-50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-slate-900">
          <div className="relative z-10 py-12 md:py-16 px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-3">
                    Ready to Build Your Next Product?
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">
                    From concept to certification — we handle the entire manufacturing journey. ISO 13485 certified, 4 SMT lines, 300K+ units/month capacity.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300"
                    >
                      Get in Touch
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href="/solutions"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      View Solutions
                    </a>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {whyChooseUs.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center"
                    >
                      <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ onOpenQuote, onOpenSchedule }) {
  return (
    <>
      <Hero onOpenQuote={onOpenQuote} onOpenSchedule={onOpenSchedule} />
      <DivisionsPreview />
      <CTASection />
    </>
  );
}
