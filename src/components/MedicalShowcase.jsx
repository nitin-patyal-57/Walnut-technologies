import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiShield, FiCpu, FiBattery, FiActivity, FiZap, FiTarget, FiThermometer } from 'react-icons/fi';

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
    image: '/TDCS.png',
  },
  {
    number: 3,
    title: 'Oxygen Concentrator',
    subtitle: 'Reliable oxygen therapy',
    description: 'Reliable oxygen concentrators available in 5L and 10L configurations with single and dual flow options. Designed for clinical and homecare settings with low noise operation.',
    highlights: ['5L & 10L Flow', 'Single/Dual Flow', 'ISO 13485', 'Low Noise'],
    image: '/RTMS.png',
  },
  {
    number: 4,
    title: 'Walnut Compressor Nebulizer',
    subtitle: 'Respiratory therapy solutions',
    description: 'Efficient compressor nebulizer for respiratory therapy. Compact design with reliable performance for clinical and home settings. Delivers medication directly to the lungs.',
    highlights: ['Efficient Nebulization', 'Low Noise', 'Compact Design', 'Medical Grade'],
    image: '/CES repose.png',
  },
];

const capabilities = [
  {
    number: 1,
    title: 'Product Design & Development',
    subtitle: 'From concept to production',
    description: 'End-to-end product development from concept ideation to production-ready designs. Our team of 400+ engineers specializes in medical device innovation.',
    bulletPoints: [
      'Industrial Design & Ergonomics',
      'Electronic Circuit Design',
      'Firmware Development',
      'Prototype Development & Testing',
    ],
  },
  {
    number: 2,
    title: 'Regulatory & Certification',
    subtitle: 'Global compliance',
    description: 'Navigate complex regulatory landscapes with our expertise. We ensure your medical devices meet international standards for global market access.',
    bulletPoints: [
      'FDA 510(k) Preparation',
      'CE Marking & MDR Compliance',
      'ISO 13485 Quality Management',
      'IEC 60601 Safety Testing',
    ],
  },
  {
    number: 3,
    title: 'Manufacturing & Assembly',
    subtitle: 'Precision manufacturing',
    description: 'State-of-the-art manufacturing facilities with Class 10K cleanroom environment. From PCB assembly to final product packaging.',
    bulletPoints: [
      'SMT & Through-Hole Assembly',
      'Class 10K Cleanroom Production',
      'Automated Testing & QA',
      'Scalable Production Capacity',
    ],
  },
  {
    number: 4,
    title: 'Quality Assurance',
    subtitle: 'Rigorous testing protocols',
    description: 'Comprehensive quality control at every stage. Our multi-level testing ensures each device meets the highest standards of reliability and safety.',
    bulletPoints: [
      'In-Process Quality Checks',
      'Functional Testing',
      'Reliability & Stress Testing',
      'Final Inspection & Packaging',
    ],
  },
];

function BackButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute top-16 left-4 sm:top-20 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
    >
      <FiArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">All Divisions</span>
    </motion.button>
  );
}
function KeyFeatureItem({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-cyan-100 transition-all duration-300 group"
    >
      <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition-colors">
        <Icon className="w-4 h-4 text-cyan-500" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-[#0f172a] text-sm leading-tight">{feature.label}</p>
        <p className="text-slate-500 text-sm mt-0.5 leading-snug">{feature.value}</p>
      </div>
    </motion.div>
  );
}

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start gap-5">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
          <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-cyan-500/20">
              {product.number}
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{product.title}</h3>
              <p className="text-cyan-500 text-sm font-medium">{product.subtitle}</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.highlights.map((highlight) => (
              <span key={highlight} className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-600 text-xs font-medium px-3 py-1.5 rounded-full">
                <FiCheckCircle className="w-3 h-3" />
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CapabilityCard({ capability, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-cyan-500/20">
          {capability.number}
        </div>
        <div>
          <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{capability.title}</h3>
          <p className="text-cyan-500 text-sm font-medium">{capability.subtitle}</p>
        </div>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">{capability.description}</p>
      {capability.bulletPoints && (
        <ul className="space-y-2">
          {capability.bulletPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
export default function MedicalShowcase({ onBack }) {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const capabilitiesRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  const productsInView = useInView(productsRef, { once: true, margin: '-100px' });
  const capabilitiesInView = useInView(capabilitiesRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <BackButton onClick={onBack} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <img src="/medical background.png" alt="Medical Devices" className="w-full h-auto" />
        </motion.div>
      </section>

      <section ref={featuresRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Medical Device Excellence</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => (
              <KeyFeatureItem key={feature.label} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section ref={productsRef} className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Medical Device Portfolio</h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.number} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section ref={capabilitiesRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-cyan-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">End-to-End Medical Manufacturing</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <CapabilityCard key={capability.number} capability={capability} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
