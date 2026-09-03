import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiShield, FiHeart, FiCpu, FiBattery, FiActivity, FiZap, FiTarget, FiThermometer } from 'react-icons/fi';

const keyFeatures = [
  { icon: FiShield, label: 'ISO 13485 Certified', value: 'International quality management standard for medical devices' },
  { icon: FiHeart, label: 'FDA Compliant', value: 'Meets US FDA regulatory requirements for medical devices' },
  { icon: FiCpu, label: 'Class 10K Cleanroom', value: 'Controlled manufacturing environment for sterile products' },
  { icon: FiActivity, label: 'IEC 60601 Certified', value: 'Safety and performance standards for medical electrical equipment' },
  { icon: FiZap, label: 'Precision Engineering', value: 'High-accuracy sensors and components for clinical diagnostics' },
  { icon: FiTarget, label: 'Patient Safety Focus', value: 'Designed with patient safety as the core priority' },
  { icon: FiBattery, label: 'Long Battery Life', value: 'Extended operation for portable medical devices' },
  { icon: FiThermometer, label: 'Clinical Grade Accuracy', value: 'Medical-grade precision for reliable patient readings' },
  { icon: FiCpu, label: 'Digital Display', value: 'Clear, easy-to-read displays for accurate data visualization' },
  { icon: FiShield, label: 'Regulatory Compliance', value: 'CE, FDA, ISO certifications for global market access' },
  { icon: FiHeart, label: 'Home & Clinical Use', value: 'Versatile devices for both healthcare facilities and home care' },
  { icon: FiZap, label: 'Low Noise Operation', value: 'Quiet performance for patient comfort during treatment' },
];

const products = [
  {
    number: 1,
    title: 'Digital Blood Pressure Monitor',
    subtitle: 'Clinical-grade precision',
    description: 'Precision blood pressure monitoring device with advanced cuff technology and digital display for accurate clinical readings. Features memory storage for multiple readings and easy-to-use interface.',
    highlights: ['Clinical Grade', 'Digital Display', 'Memory Storage', 'FDA Cleared'],
    image: '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw.webp',
  },
  {
    number: 2,
    title: 'IR Thermometer',
    subtitle: 'Non-contact temperature measurement',
    description: 'Fast, hygienic temperature measurement with infrared technology. Ideal for clinical screening and home use. Instant readings without physical contact for maximum hygiene.',
    highlights: ['Non-Contact', 'Instant Reading', 'Hygienic', 'Battery Operated'],
    image: '/TDCS.webp',
  },
  {
    number: 3,
    title: 'Oxygen Concentrator',
    subtitle: 'Reliable oxygen therapy',
    description: 'Reliable oxygen concentrators available in 5L and 10L configurations with single and dual flow options. Designed for clinical and homecare settings with low noise operation.',
    highlights: ['5L & 10L Flow', 'Single/Dual Flow', 'ISO 13485', 'Low Noise'],
    image: '/futuristic_medical_device_zoomed_out.png',
  },
  {
    number: 4,
    title: 'Walnut Compressor Nebulizer',
    subtitle: 'Respiratory therapy solutions',
    description: 'Efficient compressor nebulizer for respiratory therapy. Compact design with reliable performance for clinical and home settings. Delivers medication directly to the lungs.',
    highlights: ['Efficient Nebulization', 'Low Noise', 'Compact Design', 'Medical Grade'],
    image: '/CES repose.webp',
  },
];

const capabilities = [
  {
    number: 1,
    title: 'Product Design & Development',
    subtitle: 'From concept to production',
    description: 'End-to-end product development from concept ideation to production-ready designs. Our team of 400+ engineers specializes in medical device innovation.',
    bulletPoints: ['Industrial Design & Ergonomics', 'Electronic Circuit Design', 'Firmware Development', 'Prototype Development & Testing'],
  },
  {
    number: 2,
    title: 'Regulatory & Certification',
    subtitle: 'Global compliance',
    description: 'Navigate complex regulatory landscapes with our expertise. We ensure your medical devices meet international standards for global market access.',
    bulletPoints: ['FDA 510(k) Preparation', 'CE Marking & MDR Compliance', 'ISO 13485 Quality Management', 'IEC 60601 Safety Testing'],
  },
  {
    number: 3,
    title: 'Manufacturing & Assembly',
    subtitle: 'Precision manufacturing',
    description: 'State-of-the-art manufacturing facilities with Class 10K cleanroom environment. From PCB assembly to final product packaging.',
    bulletPoints: ['SMT & Through-Hole Assembly', 'Class 10K Cleanroom Production', 'Automated Testing & QA', 'Scalable Production Capacity'],
  },
  {
    number: 4,
    title: 'Quality Assurance',
    subtitle: 'Rigorous testing protocols',
    description: 'Comprehensive quality control at every stage. Our multi-level testing ensures each device meets the highest standards of reliability and safety.',
    bulletPoints: ['In-Process Quality Checks', 'Functional Testing', 'Reliability & Stress Testing', 'Final Inspection & Packaging'],
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

export default function MedicalShowcase({ onBack }) {
  const [heroRef, heroVisible] = useAnimateOnScroll();
  const [featRef, featVisible] = useAnimateOnScroll();
  const [prodRef, prodVisible] = useAnimateOnScroll();
  const [capRef, capVisible] = useAnimateOnScroll();

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <button
          onClick={onBack}
          className="absolute top-16 left-4 sm:top-20 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/medical background.webp" alt="Medical Devices" className="w-full h-auto" loading="eager" />
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Medical Device Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className={`flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-cyan-100 transition-all duration-300 group ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: featVisible ? `${index * 50}ms` : '0ms' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition-colors">
                    <Icon className="w-4 h-4 text-cyan-500" />
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

      <section ref={prodRef} className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Medical Device Portfolio</h2>
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
                    <p className="text-cyan-500 text-sm font-medium mb-2">{product.subtitle}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.highlights.map((h) => (
                        <span key={h} className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-600 text-xs font-medium px-3 py-1.5 rounded-full">
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
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">End-to-End Medical Manufacturing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <div
                key={cap.number}
                className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: capVisible ? `${index * 80}ms` : '0ms' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-cyan-500/20">
                    {cap.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{cap.title}</h3>
                    <p className="text-cyan-500 text-sm font-medium">{cap.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
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
