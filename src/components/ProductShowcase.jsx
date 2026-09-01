import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiShield, FiCpu, FiWifi, FiBattery, FiRadio, FiHardDrive, FiMonitor, FiSettings } from 'react-icons/fi';

const keyFeatures = [
  { icon: FiRadio, label: 'Types', value: 'Tabletop, Pocket, DQR' },
  { icon: FiWifi, label: 'Connectivity', value: 'LTE CAT 1 - 4G, 3G, 2G, BT, WiFi' },
  { icon: FiBattery, label: 'Rechargeable Battery', value: 'Up to 6000 mAh' },
  { icon: FiHardDrive, label: 'Internal Memory', value: '4MB to 256MB' },
  { icon: FiMonitor, label: 'Audio Output', value: '2-5W audio output' },
  { icon: FiSettings, label: 'SIM Card', value: 'Nano/Micro' },
  { icon: FiSettings, label: 'POS Integration', value: 'API for POS integration' },
  { icon: FiMonitor, label: 'Add-on Features', value: 'LCD with backlight, BT, WiFi, FM, Solar' },
  { icon: FiSettings, label: 'Reset', value: 'Pin-hole reset button' },
  { icon: FiBattery, label: 'Power Saving', value: 'Worlds most power-efficient Soundboxes' },
  { icon: FiShield, label: 'Electrical Protection', value: 'Level 4 ESD Protection' },
  { icon: FiCpu, label: 'Current Consumption', value: 'PCB consumes 4mA vs 20-35mA of others' },
  { icon: FiBattery, label: 'Battery Life', value: 'Lasts 1 month on single charge' },
  { icon: FiCpu, label: 'Monthly Output', value: 'Consistent performance' },
];

const services = [
  {
    number: 1,
    title: 'Finish Soundbox Hardware',
    subtitle: 'In customer branding',
    description: 'Experience the ultimate in bespoke hardware solutions with our end-to-end Soundbox hardware system, customized to reflect your brand.',
    highlights: ['Custom Branding', '500K+ Units/Month', 'End-to-End Solution'],
  },
  {
    number: 2,
    title: 'MQTT Broker',
    subtitle: 'Efficient messaging protocol',
    description: 'Utilize a single broker to streamline operations and enhance efficiency. Benefit from quick transaction announcements.',
    bulletPoints: ['Efficient Management: Single Broker', 'Lower Latency: Quick Transaction', 'Consistency: Avoids sync issues', 'Data Security: Robust measures'],
  },
  {
    number: 3,
    title: 'Terminal Management System',
    subtitle: 'Manage devices anywhere',
    description: 'Gain complete control over your devices with our advanced Terminal Management System.',
    bulletPoints: ['Device and Network Info', 'App Details', 'Scheduler: OTA jobs and ads', 'Onboarding: Link devices to merchants', 'Security Metrics Monitoring'],
  },
  {
    number: 4,
    title: 'SIM Card for Soundboxes',
    subtitle: 'Seamless connectivity',
    description: 'Collaborate with leading SIM card providers to deliver hassle-free network connectivity.',
    highlights: ['Multi-Carrier', '4G LTE', 'Always Connected'],
  },
  {
    number: 5,
    title: 'Field Service & Deployment App',
    subtitle: 'Android and iOS App',
    description: 'Our innovative app links merchants to Soundboxes and allocates QR codes effortlessly.',
    highlights: ['Android & iOS', 'QR Allocation', 'Fault Detection'],
  },
];

const deviceMetrics = [
  { label: 'Storage Usage', value: '99% (6 GB used)', bar: 99, color: 'bg-red-500' },
  { label: 'Memory Usage', value: '5% (50 MB used)', bar: 5, color: 'bg-emerald-500' },
  { label: 'CPU Usage', value: '10%', bar: 10, color: 'bg-blue-500' },
  { label: 'Battery Usage', value: '35% remaining', bar: 35, color: 'bg-amber-500' },
  { label: 'IP Address', value: '192.168.1.10', bar: null },
  { label: 'Network Strength', value: 'Strong Signal', bar: null },
  { label: 'IMEI', value: '490154203237518', bar: null },
  { label: 'Operator Name', value: 'Telecom', bar: null },
  { label: 'Device Location', value: '34.0522 N, 118.2437 W', bar: null },
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

export default function ProductShowcase({ onBack }) {
  const [heroRef, heroVisible] = useAnimateOnScroll();
  const [featRef, featVisible] = useAnimateOnScroll();
  const [svcRef, svcVisible] = useAnimateOnScroll();
  const [tmsRef, tmsVisible] = useAnimateOnScroll();

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <button onClick={onBack} className="absolute top-16 left-4 sm:top-20 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer">
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/fintech bckground.webp" alt="Fintech Soundbox" className="w-full h-auto" loading="eager" />
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Worlds Most Efficient Soundboxes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className={`flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-blue-100 transition-all duration-300 group ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: featVisible ? `${index * 50}ms` : '0ms' }}>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4 h-4 text-blue-500" />
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

      <section ref={svcRef} className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${svcVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Our Solutions and Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={service.number} className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${svcVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: svcVisible ? `${index * 80}ms` : '0ms' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-blue-500/20">{service.number}</div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{service.title}</h3>
                    <p className="text-blue-500 text-sm font-medium">{service.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.description}</p>
                {service.bulletPoints && (
                  <ul className="space-y-2 mb-4">
                    {service.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {service.highlights && (
                  <div className="flex flex-wrap gap-2">
                    {service.highlights.map((h) => (
                      <span key={h} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                        <FiCheckCircle className="w-3 h-3" />{h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={tmsRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${tmsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Terminal Management</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Device and Network Details</h2>
          </div>
          <div className={`max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${tmsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="bg-[#0f172a] px-6 py-4">
              <h3 className="text-white font-semibold text-lg">Device Status</h3>
              <p className="text-slate-400 text-sm">IMEI: 490154203237518</p>
            </div>
            <div className="divide-y divide-slate-100">
              {deviceMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 text-sm font-medium">{metric.label}</span>
                  <div className="flex items-center gap-4">
                    {metric.bar !== null && (
                      <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className={`h-full ${metric.color} rounded-full transition-all duration-1000`} style={{ width: tmsVisible ? `${metric.bar}%` : '0%' }} />
                      </div>
                    )}
                    <span className="text-[#0f172a] font-semibold text-sm min-w-[120px] text-right">{metric.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
