import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SEO from '../components/SEO';
import {
  FiArrowLeft, FiArrowRight, FiGlobe, FiCpu, FiTrendingUp,
  FiShield, FiZap, FiHeart, FiUsers, FiCheckCircle,
  FiSettings, FiStar, FiCloud, FiActivity, FiRadio
} from 'react-icons/fi';

const futureData = {
  global: {
    title: 'Global',
    subtitle: 'Expanding Our Technology and Manufacturing Reach',
    heroImage: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    colorLight: 'bg-blue-100',
    intro: 'From a 2,000 sqft facility in Mohali to serving 20+ countries worldwide — our global journey is just beginning.',
    bigStatement: 'Our Vision: 50+ Countries by 2030',
    timeline: [
      { year: '2016', event: 'Started with domestic market — hospitals in Delhi NCR and Punjab' },
      { year: '2019', event: 'First international orders from Southeast Asia and Middle East' },
      { year: '2023', event: 'Expanded to 20+ countries. CE, FCC certifications enabled European and US market entry' },
      { year: '2025', event: 'Crossed 10 million units manufactured, shipped globally' },
    ],
    features: [
      { icon: FiGlobe, title: '20+ Countries Today', text: 'Our products operate across India, Southeast Asia, Middle East, Africa, and Europe. Every product ships with full international certifications — CE, FCC, and regional compliance.', stat: '20+' },
      { icon: FiShield, title: 'Global Certifications', text: 'ISO 13485, CE (Europe), FCC (US), PCI-DSS (payments), IATF 16949 (automotive), RoHS, and UL. These open doors to regulated markets worldwide.', stat: '12+' },
      { icon: FiUsers, title: '500+ Global Clients', text: 'HDFC Bank, SBI, Apollo Hospitals, Indian Army, Sun Pharma, Cipla, Paytm, BharatPe — serving leading brands across healthcare, defence, banking, and pharmaceuticals.', stat: '500+' },
      { icon: FiTrendingUp, title: '50+ by 2030', text: 'Our roadmap targets Latin America, Central Asia, and deeper penetration in Europe and Africa. Building distribution partnerships and regional compliance.', stat: '50+' },
    ],
    splitContent: {
      title: 'How We Go Global',
      text: 'Every product we build is designed for global markets from day one. Our certifications — CE, FCC, PCI-DSS, IATF 16949 — are not afterthoughts. They are built into our design and manufacturing process. This means our clients can deploy our products anywhere in the world without worrying about compliance.',
      image: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp',
    },
    nextSlug: 'intelligent',
    nextTitle: 'Intelligent',
    nextColor: 'from-blue-600 to-blue-700',
  },
  intelligent: {
    title: 'Intelligent',
    subtitle: 'Building Smarter Products with AI and IoT',
    heroImage: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    colorLight: 'bg-blue-100',
    intro: 'We are building smarter connected products with AI and IoT integration. Our Industry 5.0 ecosystem combines AI, Digital Twin, and human-centric automation.',
    bigStatement: '50M+ Data Points. Every Day.',
    timeline: [
      { year: '2021', event: 'Launched AI-powered WalkLab with real-time adaptive therapy algorithms' },
      { year: '2023', event: 'IoT division deployed 100+ connected products with 50M+ daily data points' },
      { year: '2024', event: 'Adopted Industry 4.0 — MES, Digital Workflow, full production traceability' },
      { year: '2025', event: 'Pioneering Industry 5.0 — Digital Twin, AI analytics, human-centric manufacturing' },
    ],
    features: [
      { icon: FiCpu, title: 'AI & Machine Learning', text: 'WalkLab\'s adaptive therapy, predictive maintenance, computer vision quality inspection, and demand forecasting. 50M+ data points processed daily.', stat: '50M+' },
      { icon: FiCloud, title: 'Cloud IoT Platform', text: 'AWS IoT, Azure IoT Hub, and custom cloud backends. 1M+ devices managed, 10TB data processed monthly. Real-time monitoring and OTA updates.', stat: '10TB' },
      { icon: FiActivity, title: 'Digital Twin', text: 'Virtual simulation of manufacturing processes. Test designs virtually before prototyping — reducing development time by 40% and cost by 30%.', stat: '40%' },
      { icon: FiRadio, title: 'Connected Devices', text: 'BLE, WiFi, LoRa, NB-IoT connectivity. From smart locks to payment terminals to medical devices — everything connected and optimized.', stat: '1M+' },
    ],
    splitContent: {
      title: 'Industry 5.0 in Action',
      text: 'We are not just adopting new technology — we are building an ecosystem. Our Industry 5.0 approach combines AI analytics, Digital Twin simulation, IoT connectivity, and human-centric automation. Every product we make is smarter than the last, and every process is more efficient.',
      image: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp',
    },
    nextSlug: 'scalable',
    nextTitle: 'Scalable',
    nextColor: 'from-blue-600 to-blue-700',
  },
  scalable: {
    title: 'Scalable',
    subtitle: 'Solutions Ready for Real-World Deployment at Any Scale',
    heroImage: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    colorLight: 'bg-blue-100',
    intro: 'From prototyping to mass production — we create solutions ready for real-world deployment at any scale.',
    bigStatement: '500K+ Units. Every Month.',
    timeline: [
      { year: '2016', event: 'Started with 2,000 sqft facility and manual assembly' },
      { year: '2019', event: 'Expanded to 150,000 sqft with 2 SMT lines' },
      { year: '2023', event: 'Added 3rd and 4th SMT lines. Capacity reached 500K+ units/month' },
      { year: '2026', event: '4th SMT line operational. Placement accuracy 99.95%, yield rate 99.8%' },
    ],
    features: [
      { icon: FiSettings, title: '150,000 sqft Facility', text: 'Class 10K cleanroom, 4 high-speed SMT lines, automated optical inspection, X-ray testing, and dedicated R&D labs in Mohali, Punjab.', stat: '150K' },
      { icon: FiZap, title: '500K+ Units/Month', text: '4 SMT lines handle up to 0201 components with 99.95% placement accuracy. 12-layer HDI PCBs, fine-pitch BGA, complex assemblies.', stat: '500K+' },
      { icon: FiStar, title: 'Vertical Integration', text: 'PCB design, SMT assembly, mechanical fabrication, firmware, plastic molding, testing — everything in-house. 24-48 hour prototyping.', stat: '24hr' },
      { icon: FiCheckCircle, title: 'Quality at Scale', text: 'ISO 13485, ISO 9001, IPC-A-610, J-STD-001 certified. Automated testing at every stage. Zero non-conformities in 2024 recertification.', stat: '99.8%' },
    ],
    splitContent: {
      title: 'Built for Scale',
      text: 'Our 150,000 sqft facility in Mohali is designed for volume without compromising quality. 4 high-speed SMT lines, Class 10K cleanroom, automated testing — we can scale from 100 units to 100,000 units without skipping a beat. 99.8% first-pass yield is not a number we achieved by accident.',
      image: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp',
    },
    nextSlug: 'global',
    nextTitle: 'Global',
    nextColor: 'from-blue-600 to-blue-700',
  },
};

function AnimatedCounter({ value, color }) {
  return (
    <span className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {value}
    </span>
  );
}

export default function FutureDetailPage() {
  const { slug } = useParams();
  const data = futureData[slug];
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <Link to="/about" className="text-blue-600 hover:underline">Back to About</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.title} - Where We're Going`}
        description={data.intro}
        path={`/about/future/${slug}`}
      />

      {/* Parallax Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.img
          src={data.heroImage}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: heroY, scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Link to="/about" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
                <FiArrowLeft className="w-4 h-4" />
                Back to About
              </Link>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-display text-white mb-4 leading-none">
                {data.title}
              </h1>
              <p className="text-xl text-white/60 max-w-2xl">{data.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Big Statement */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r ${data.color} blur-3xl`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r ${data.color} blur-3xl`} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black font-display bg-gradient-to-r ${data.color} bg-clip-text text-transparent leading-tight`}>
              {data.bigStatement}
            </h2>
            <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto">{data.intro}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`py-12 ${data.colorBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <AnimatedCounter value={f.stat} color={data.color} />
                <div className="text-sm text-slate-600 mt-1 font-medium">{f.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Content — Image Left, Text Right */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={data.splitContent.image}
                  alt={data.splitContent.title}
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${data.color} opacity-10`} />
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl bg-gradient-to-r ${data.color} opacity-20 blur-xl`} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className={`text-xs font-bold ${data.colorText} uppercase tracking-widest`}>How We Do It</span>
              <h3 className="text-3xl font-black text-slate-900 mt-2 mb-6">{data.splitContent.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{data.splitContent.text}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid — Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-slate-900 mb-12 text-center"
          >
            Key Capabilities
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${data.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                <div className="relative flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{f.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — Horizontal Scroll */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-slate-900 mb-12 text-center"
          >
            Our Journey
          </motion.h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="grid grid-cols-4 gap-4">
              {data.timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-xl mb-4`}>
                    <span className="text-sm font-black text-white">{item.year}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed px-2">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next CTA */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r ${data.nextColor} opacity-10 blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r ${data.nextColor} opacity-10 blur-3xl`} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Next Chapter</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-8">{data.nextTitle}</h2>
            <Link
              to={`/about/future/${data.nextSlug}`}
              className={`inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r ${data.nextColor} text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg`}
            >
              Explore {data.nextTitle}
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-8">
              <Link to="/about" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                Back to About Page
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
