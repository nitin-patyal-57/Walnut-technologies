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
    description: 'Life-critical medical electronics with full regulatory compliance — from oxygen concentrators to rehabilitation robots.',
    image: '/RTMS.png',
    color: 'from-cyan-500 to-blue-600',
    icon: FiHeart,
    link: '/solutions?category=Medical+Devices',
    products: [
      { name: 'Oxygen Concentrators', image: '/RTMS.png' },
      { name: 'BP Monitors', image: '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw.webp' },
      { name: 'WalkLab Gait Training', image: '/walklab 3.0.jpeg' },
      { name: 'IR Thermometers', image: '/TDCS.png' },
      { name: 'Compressor Nebulizers', image: '/CES repose.png' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Systems',
    subtitle: 'PCI-DSS, NPCI, RBI Certified',
    description: 'Secure payment terminal manufacturing with end-to-end compliance for modern financial ecosystems.',
    image: '/paytm soundbox.png',
    color: 'from-violet-500 to-purple-600',
    icon: FiCreditCard,
    link: '/solutions?category=Payment+Systems',
    products: [
      { name: 'Smart POS Terminals', image: '/paytm soundbox.png' },
      { name: 'QR Soundboxes', image: '/Pocket Soundbox.png' },
      { name: 'QR Scanner', image: '/Qr scanner.jpg' },
      { name: 'EMV Devices', image: '/soundbox (2).png' },
    ],
  },
  {
    id: 'custom',
    title: 'Custom Electronics',
    subtitle: '4 SMT Lines, 300K+ Units/Month',
    description: 'Full-spectrum OEM/ODM services from concept to delivery with 4 advanced SMT production lines.',
    image: '/smart lock.PNG',
    color: 'from-amber-500 to-orange-600',
    icon: FiCpu,
    link: '/solutions?category=Custom+Electronics',
    products: [
      { name: 'PCB Design', image: '/3d image.png' },
      { name: 'Box Build Assembly', image: '/smart lock.PNG' },
      { name: 'IoT Solutions', image: '/1.png' },
    ],
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
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Our Solutions
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Three Divisions,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 font-black">
              One Standard
            </span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Specialized manufacturing divisions serving the most demanding industries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {divisions.map((div, index) => {
            const Icon = div.icon;
            return (
              <motion.div
                key={div.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={div.image}
                    alt={div.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  <div className={`absolute top-3 left-3 inline-flex w-9 h-9 rounded-lg bg-gradient-to-br ${div.color} items-center justify-center shadow-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="absolute bottom-3 left-4 text-lg font-bold font-display text-white">{div.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium text-cyan-600 mb-1.5">{div.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{div.description}</p>

                  {/* Product Images Grid */}
                  <div className="mb-3">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Products</p>
                    <div className="grid grid-cols-5 gap-1">
                      {div.products.map((product) => (
                        <div key={product.name} className="group/img relative aspect-square overflow-hidden rounded-md border border-slate-200 hover:border-slate-300 transition-all">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                            <p className="text-[6px] font-medium text-white leading-tight truncate">{product.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={div.link}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-cyan-600 transition-colors group/link"
                  >
                    Explore Solutions
                    <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
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
