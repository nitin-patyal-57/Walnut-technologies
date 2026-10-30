import { useRef, useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiShield, FiCpu, FiWifi, FiBattery, FiRadio, FiHardDrive, FiMonitor, FiSettings } from 'react-icons/fi';
import Picture from '../components/Picture';

const brandedSoundboxes = [
  { image: '/images/products/RTOS.webp', name: 'RTOS' },
  { image: '/images/products/DQR.webp', name: 'DQR' },
  { image: '/images/products/LDQR.webp', name: 'LDQR' },
  {
    image: '/images/fintech%20soudbox/sbi_payments_qr_4k_white_transparent.png',
    name: 'SBI Payments',
    details: ['Common soundbox', '2000 mAh battery', 'QR sticker', '4G SIM network', '4 switch types', 'Speaker'],
  },
  {
    image: '/images/fintech%20soudbox/paytm_qr_4k_white_transparent.png',
    name: 'Paytm',
    details: ['2600 mAh battery', 'QR scanner', '57 mm speaker', 'Single or dual SIM', '4G/2G connectivity', 'Removable battery', 'QR standee'],
  },
  {
    image: '/images/fintech%20soudbox/mswipe_qr_4k_white_transparent.png',
    name: 'Mswipe',
    details: ['2000 mAh battery', 'QR', '57 mm speaker', 'Merchant segment display', 'Single SIM', '4G/2G connectivity', '4 button types', 'Non-removable battery'],
  },
  {
    image: '/images/fintech%20soudbox/hdfc_payzapp_qr_4k_white_transparent.png',
    name: 'HDFC PayZapp',
    details: ['2000 mAh battery', 'QR code standee', '40 mm Miller speaker', 'Dual SIM available', '4G/2G connectivity'],
  },
  {
    image: '/images/fintech%20soudbox/bharatpe_qr_4k_white_transparent.png',
    name: 'BharatPe',
    details: ['Non-removable button', '2000 mAh battery', 'QR sticker', '57 mm loud speaker', '4G/2G connectivity', '5 switch types'],
  },
  {
    image: '/images/fintech%20soudbox/airtel_payments_bank_qr_4k_white_transparent.png',
    name: 'Airtel Payments Bank',
    details: ['Common soundbox', '2000 mAh battery', 'QR sticker', '4G SIM network', '4 switch types', 'Speaker'],
  },
];

const commonSoundboxDetails = ['USB-C charging port', 'LED charging indicator', 'Reset button'];

const soundboxProducts = [
  {
    id: 'rtos',
    name: 'RTOS',
    tagline: 'All In One',
    image: '/images/products/RTOS.webp',
    description: 'All-in-one RTOS-based soundbox with multiple display configurations to suit every merchant need. Features QR generation and built-in keyboard for seamless payment operations.',
    features: [
      { label: '3.47" LCD Display', desc: 'Large customer-facing display for clear transaction visibility' },
      { label: '2.8" LCD Display', desc: 'Compact LCD option for space-efficient deployment' },
      { label: 'Segment Display', desc: 'Cost-effective segment display for basic transactions' },
      { label: '2.4" Merchant Display', desc: 'Dedicated merchant-side display for operation feedback' },
      { label: 'QR Generation', desc: 'On-device QR code generation for instant payment acceptance' },
      { label: 'Built-in Keyboard', desc: 'Physical keyboard for quick amount entry and navigation' },
    ],
  },
  {
    id: 'dqr',
    name: 'DQR',
    tagline: 'Digital QR',
    image: '/images/products/DQR.webp',
    description: 'Digital QR soundbox with LCD display for clear transaction visibility. A compact and efficient design built for modern payment acceptance with high-contrast digital display.',
    features: [
      { label: 'Digital QR Display', desc: 'High-contrast LCD for clear QR code presentation' },
      { label: 'LCD Screen', desc: 'Bright display for transaction amount and confirmation' },
      { label: 'Compact Design', desc: 'Space-saving form factor for any counter setup' },
      { label: 'Clear Audio', desc: 'Loud and clear payment confirmation alerts' },
      { label: 'Fast Processing', desc: 'Quick transaction processing for minimal wait times' },
      { label: 'Easy Deployment', desc: 'Plug-and-play setup with minimal configuration' },
    ],
  },
  {
    id: 'ldqr',
    name: 'LDQR',
    tagline: 'Large Display QR',
    image: '/images/products/LDQR.webp',
    description: 'Premium soundbox with a 10-inch touchscreen customer display and 2.4-inch merchant display with keyboard. Generate custom QR codes and accept NFC tap-and-pay contactless payments.',
    features: [
      { label: '10" Touch Screen', desc: 'Large interactive customer display for engagement' },
      { label: '2.4" Merchant Display', desc: 'Dedicated screen for merchant-side operations' },
      { label: 'Built-in Keyboard', desc: 'Physical keyboard for QR code generation and navigation' },
      { label: 'Custom QR Generation', desc: 'Generate merchant-specific QR codes on demand' },
      { label: 'NFC Tap and Pay', desc: 'Contactless payment acceptance via NFC technology' },
      { label: 'Contactless Payments', desc: 'Support for tap-to-pay cards and mobile wallets' },
    ],
  },
];

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
  const [prodRef, prodVisible] = useAnimateOnScroll();
  const brandedSoundboxesRef = useRef(null);
  const [featRef, featVisible] = useAnimateOnScroll();
  const [svcRef, svcVisible] = useAnimateOnScroll();
  const [tmsRef, tmsVisible] = useAnimateOnScroll();

  const scrollBrandedSoundboxes = (direction) => {
    const track = brandedSoundboxesRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative pt-14">
        <button onClick={onBack} className="absolute top-16 left-4 sm:top-20 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer">
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 md:-mt-24 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Picture sizes="100vw" src="/images/backgrounds/fintech-homebackground.webp" alt="Fintech Soundbox" width="1920" height="600" className="w-full h-auto" loading="lazy" />
        </div>
      </section>

      <section ref={prodRef} className="py-5 md:py-7 bg-slate-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-3 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-blue-500 font-semibold text-xs uppercase tracking-wider mb-1">Our Products</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Soundbox Models</h2>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => scrollBrandedSoundboxes(-1)}
                  aria-label="Scroll to previous soundboxes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <FiArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBrandedSoundboxes(1)}
                  aria-label="Scroll to next soundboxes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <FiArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div
              ref={brandedSoundboxesRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3"
              role="region"
              aria-label="Soundbox product images"
              tabIndex={0}
            >
              {brandedSoundboxes.map((product) => {
                const model = soundboxProducts.find((item) => item.name === product.name);
                const details = product.details
                  || model?.features.slice(0, 3).map((feature) => feature.label)
                  || [];
                return (
                  <article
                    key={product.image}
                    className="w-[82%] shrink-0 snap-start overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm sm:w-[48%] lg:w-[calc((100%-2.5rem)/3)]"
                  >
                    <div className="relative flex h-[150px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 sm:h-[160px] lg:h-[180px]">
                      <Picture
                        src={product.image}
                        alt={`${product.name} soundbox`}
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 460px"
                        loading="lazy"
                        decoding="async"
                        className={`relative z-10 h-full w-full object-contain p-3 ${model ? 'scale-110' : ''}`}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="mb-1 text-lg font-bold text-slate-900">{product.name}</h3>
                      {model && (
                        <p className="mb-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{model.description}</p>
                      )}
                      <ul className="grid grid-cols-2 gap-1.5">
                        {[...details, ...commonSoundboxDetails].map((detail) => (
                          <li key={detail} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium leading-tight text-blue-700">
                            <FiCheckCircle className="h-3 w-3 shrink-0 text-blue-600" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
                        <FiCheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
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

      <section ref={tmsRef} className="bg-white py-12 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 text-center transition-all duration-500 ${tmsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-500">Terminal Management</p>
            <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">Manage Soundboxes from Anywhere</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
              Monitor device status, network health and fleet activity from one centralized dashboard.
            </p>
          </div>
          <div className={`mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.35)] transition-all duration-500 ${tmsVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-slate-600 sm:text-sm">Terminal Management System</span>
              </div>
              <span className="hidden items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:inline-flex">
                <FiMonitor className="h-3.5 w-3.5" />
                Device dashboard
              </span>
            </div>
            <div className="bg-[#eaf4fc] p-2 sm:p-4">
              <Picture
                src="/images/fintech%20soudbox/TMS%20soudbox.png"
                alt="Terminal Management System dashboard showing soundbox device, network, battery and performance details"
                sizes="(max-width: 1280px) 100vw, 1152px"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
