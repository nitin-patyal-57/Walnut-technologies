import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiCpu, FiMonitor, FiSettings, FiShield, FiZap, FiThermometer } from 'react-icons/fi';

const keyFeatures = [
  { icon: FiMonitor, label: 'High Resolution Display', value: 'Crystal clear visuals for real-time vehicle data' },
  { icon: FiCpu, label: 'Advanced Processing', value: 'Real-time data processing for instant driver feedback' },
  { icon: FiZap, label: 'Low Power Consumption', value: 'Energy efficient design for extended vehicle battery life' },
  { icon: FiShield, label: 'Rugged Build', value: 'Industrial grade components for harsh environments' },
  { icon: FiSettings, label: 'Customizable Interface', value: 'Configurable layouts and themes for different vehicles' },
  { icon: FiThermometer, label: 'Temperature Resistant', value: 'Operating range from -40C to +85C for all climates' },
];

const products = [
  {
    number: 1,
    title: 'Digital Cluster Display',
    subtitle: 'Advanced instrumentation',
    description: 'Next-generation automotive cluster displays with high-resolution screens, real-time vehicle data visualization, and customizable driver interfaces. Built for durability and clarity.',
    highlights: ['Digital Cluster', 'Real-time Data', 'High Resolution', 'Durable'],
    image: '/cluster1.png',
  },
];

const capabilities = [
  {
    number: 1,
    title: 'Display Technology',
    subtitle: 'Crystal clear visuals',
    description: 'High-brightness LCD and TFT displays with anti-glare coating, wide viewing angles, and sunlight-readable technology for optimal visibility in all conditions.',
    bulletPoints: ['LCD/TFT Displays', 'Anti-glare Coating', 'Wide Viewing Angles', 'Sunlight Readable'],
  },
  {
    number: 2,
    title: 'Real-time Data Processing',
    subtitle: 'Instant vehicle feedback',
    description: 'Advanced microcontrollers and processors that handle multiple data streams simultaneously, providing instant updates for speed, RPM, fuel, temperature, and diagnostic information.',
    bulletPoints: ['Multi-stream Processing', 'Instant Updates', 'Diagnostic Integration', 'CAN Bus Support'],
  },
  {
    number: 3,
    title: 'Custom Design & Engineering',
    subtitle: 'Tailored solutions',
    description: 'From concept to production, we design custom cluster displays that match your vehicle specifications, brand identity, and functional requirements.',
    bulletPoints: ['Custom Layouts', 'Brand Integration', 'Prototype Development', 'DFM Optimization'],
  },
  {
    number: 4,
    title: 'Quality & Certification',
    subtitle: 'Automotive grade quality',
    description: 'Our products meet stringent automotive quality standards with comprehensive testing for temperature, vibration, humidity, and electromagnetic compatibility.',
    bulletPoints: ['IATF 16949 Ready', 'AEC-Q100 Compliant', 'EMC Tested', 'Vibration Tested'],
  },
];

function useAnimateOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function AutomotiveShowcase({ onBack }) {
  const [heroRef, heroVisible] = useAnimateOnScroll();
  const [prodRef, prodVisible] = useAnimateOnScroll();
  const [capRef, capVisible] = useAnimateOnScroll();

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <button
          onClick={onBack}
          className="absolute top-44 left-4 sm:top-48 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 -mt-28 md:-mt-32 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/cluster background.png" alt="Automotive Cluster Display" className="w-full h-auto scale-110" loading="eager" />
        </div>
      </section>

      <section ref={prodRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Automotive Cluster Systems</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className={`flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl                   hover:shadow-lg hover:border-blue-100 transition-all duration-300 group ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: prodVisible ? `${index * 50}ms` : '0ms' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a] text-sm leading-tight">{feature.label}</p>
                    <p className="text-slate-500 text-sm mt-0.5 leading-snug">{feature.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Automotive Product Portfolio</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div
                key={product.number}
                className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: prodVisible ? `${index * 80}ms` : '0ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight mb-1">{product.title}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-2">{product.subtitle}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.highlights.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                          <FiCheckCircle className="w-3 h-3" />{h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={capRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">End-to-End Automotive Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <div
                key={cap.number}
                className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: capVisible ? `${index * 80}ms` : '0ms' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-blue-500/20">
                    {cap.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{cap.title}</h3>
                    <p className="text-blue-600 text-sm font-medium">{cap.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheckCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
