import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiWifi, FiCpu, FiCloud, FiLock, FiActivity, FiShield, FiZap, FiTarget, FiSmartphone, FiMapPin } from 'react-icons/fi';

const keyFeatures = [
  { icon: FiWifi, label: 'BLE/WiFi Connectivity', value: 'Seamless wireless communication for smart connected devices' },
  { icon: FiCloud, label: 'Cloud Integration', value: 'Secure cloud platform for remote monitoring and control' },
  { icon: FiCpu, label: 'Edge Computing', value: 'On-device processing for low-latency real-time decisions' },
  { icon: FiLock, label: 'Remote Access Control', value: 'Control devices from anywhere with secure authentication' },
  { icon: FiActivity, label: 'Real-time Monitoring', value: 'Live device status and telemetry data at your fingertips' },
  { icon: FiShield, label: 'End-to-End Security', value: 'Encrypted communication and secure data transmission' },
  { icon: FiSmartphone, label: 'Mobile App Ready', value: 'Companion applications for iOS and Android platforms' },
  { icon: FiMapPin, label: 'GPS Tracking', value: 'Precise location tracking for fleet and asset management' },
];

const products = [
  {
    number: 1,
    title: 'IoT Smart Lock',
    subtitle: 'Connected access control',
    description: 'Connected smart lock solution with BLE/WiFi connectivity, remote access control, and real-time monitoring capabilities. Cloud integration for secure management from anywhere.',
    highlights: ['BLE/WiFi Connected', 'Remote Access', 'Real-time Monitoring', 'Cloud Integration'],
    image: '/IOT lock smart.png',
  },
  {
    number: 2,
    title: 'GPS Gateway',
    subtitle: 'Asset tracking & telemetry',
    description: 'Reliable GPS gateway for industrial and logistics applications. Real-time tracking, telemetry reporting, and fleet management with secure cloud connectivity.',
    highlights: ['GPS Tracking', 'Real-time Telemetry', 'Fleet Management', 'Cloud Connected'],
    image: '/GPS Gateway.webp',
  },
];

const capabilities = [
  {
    number: 1,
    title: 'IoT Product Design & Development',
    subtitle: 'From concept to connected product',
    description: 'End-to-end IoT product development from hardware design to cloud platform. Our engineers specialize in embedded systems, firmware, and connectivity solutions.',
    bulletPoints: ['Embedded Hardware Design', 'Firmware & RTOS Development', 'BLE/WiFi/LTE Connectivity', 'Cloud Platform Integration'],
  },
  {
    number: 2,
    title: 'Security & Authentication',
    subtitle: 'Bank-grade device security',
    description: 'Secure your IoT ecosystem with end-to-end encryption, secure boot, and tamper detection. We implement industry-standard security protocols for mission-critical devices.',
    bulletPoints: ['End-to-End Encryption', 'Secure Element Integration', 'Certificate Management', 'Tamper Detection'],
  },
  {
    number: 3,
    title: 'Manufacturing & Assembly',
    subtitle: 'High-volume IoT production',
    description: 'Scalable manufacturing with 4 SMT lines and 500K+ units per month capacity. Full traceability from component to finished connected device.',
    bulletPoints: ['SMT & PCB Assembly', 'Antenna Tuning & RF Testing', 'Firmware Flashing & Calibration', 'End-of-Line Functional Testing'],
  },
  {
    number: 4,
    title: 'Cloud & Mobile Platforms',
    subtitle: 'Complete software ecosystem',
    description: 'We develop companion mobile apps and cloud dashboards that bring your IoT devices to life with real-time analytics and remote management.',
    bulletPoints: ['Cloud Dashboard Development', 'Mobile App Development', 'OTA Update Infrastructure', 'Data Analytics & Reporting'],
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

export default function IoTShowcase({ onBack }) {
  const [heroRef, heroVisible] = useAnimateOnScroll();
  const [featRef, featVisible] = useAnimateOnScroll();
  const [prodRef, prodVisible] = useAnimateOnScroll();
  const [capRef, capVisible] = useAnimateOnScroll();

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:top-28 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/IOT smartlock background.png" alt="IoT Solutions" className="w-full h-auto -mt-10 md:-mt-12" loading="eager" />
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Connected Intelligence</h2>
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
                    <Icon className="w-4 h-4 text-cyan-600" />
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
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">IoT Product Portfolio</h2>
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
                    <p className="text-cyan-600 text-sm font-medium mb-2">{product.subtitle}</p>
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
            <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">End-to-End IoT Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <div
                key={cap.number}
                className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: capVisible ? `${index * 80}ms` : '0ms' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-cyan-500/20">
                    {cap.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{cap.title}</h3>
                    <p className="text-cyan-600 text-sm font-medium">{cap.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
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
