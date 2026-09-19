import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiCheckCircle, FiShield, FiGlobe, FiArrowUpRight,
  FiTrendingUp, FiUsers
} from 'react-icons/fi';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const processImages = [
    { image: '/idea-and-requirement.webp', num: '01', from: 'IDEA', to: 'RESEARCH' },
    { image: '/research-and-market-analysis.webp', num: '02', from: 'RESEARCH', to: 'DESIGN' },
    { image: '/design-and-engineering.webp', num: '03', from: 'DESIGN', to: 'MANUFACTURING' },
    { image: '/manufacturing-engineering-and-mold-design.webp', num: '04', from: 'MANUFACTURING', to: 'TESTING' },
    { image: '/validation-and-testing.webp', num: '05', from: 'TESTING', to: 'MOLDING' },
    { image: '/prototype-development.webp', num: '06', from: 'MOLDING', to: 'QA' },
    { image: '/quality-assurance.webp', num: '07', from: 'QA', to: 'PACKAGING' },
    { image: '/packaging-and-dispatch.webp', num: '08', from: 'PACKAGING', to: 'SUPPORT' },
    { image: '/continuous-improvement.webp', num: '09', from: 'SUPPORT', to: 'IMPROVEMENT' },
    { image: '/after-sales-support.webp', num: '10', from: 'IMPROVEMENT', to: 'SUPPORT' },
  ];

  return (
    <section className="relative overflow-hidden" ref={ref}>
      {/* Production Process - Hexagonal Grid */}
      <div className="bg-white py-2 md:py-3 flex-shrink-0">
        <div className="w-full px-2">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-2"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display text-slate-900 leading-tight mb-1">
              Production Process
            </h2>
            <div className="w-14 h-0.5 bg-blue-600 mx-auto rounded-full" />
          </motion.div>

          {/* Circle Grid - Row 1 (5 items) */}
          <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-4 mb-1 overflow-x-auto scrollbar-hide px-1">
            {processImages.slice(0, 5).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-center shrink-0"
              >
                <div className="relative group">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <img 
                      src={item.image} 
                      alt={item.to}
                      width="150"
                      height="150"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-blue-600 text-white text-[10px] sm:text-[10px] md:text-[10px] font-bold flex items-center justify-center shadow-md z-10">
                      {item.num}
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <p className="text-[10px] sm:text-xs md:text-xs font-bold text-slate-900 leading-tight">{item.from}</p>
                    <p className="text-[10px] sm:text-xs md:text-xs text-blue-600 font-semibold">{item.to}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex items-center mx-0.5 sm:mx-1 md:mx-2 -mt-3 md:-mt-4">
                    <div className="w-2 sm:w-3 md:w-6 h-[1.5px] bg-blue-400" />
                    <div className="w-0 h-0 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent border-l-[3px] border-l-blue-400 md:border-t-[3px] md:border-b-[3px] md:border-l-[5px]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Circle Grid - Row 2 (5 items) */}
          <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto scrollbar-hide px-1">
            {processImages.slice(5, 10).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="flex items-center shrink-0"
              >
                <div className="relative group">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <img 
                      src={item.image} 
                      alt={item.to}
                      width="150"
                      height="150"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-blue-600 text-white text-[10px] sm:text-[10px] md:text-[10px] font-bold flex items-center justify-center shadow-md z-10">
                      {item.num}
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <p className="text-[10px] sm:text-xs md:text-xs font-bold text-slate-900 leading-tight">{item.from}</p>
                    <p className="text-[10px] sm:text-xs md:text-xs text-blue-600 font-semibold">{item.to}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex items-center mx-0.5 sm:mx-1 md:mx-2 -mt-3 md:-mt-4">
                    <div className="w-2 sm:w-3 md:w-6 h-[1.5px] bg-blue-400" />
                    <div className="w-0 h-0 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent border-l-[3px] border-l-blue-400 md:border-t-[3px] md:border-b-[3px] md:border-l-[5px]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Connecting line from Row 1 to Row 2 */}
          <div className="flex justify-center my-1">
            <div className="w-[2px] h-2 bg-blue-400" />
          </div>
        </div>
      </div>

      {/* Journey Section */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display text-slate-900 leading-tight mb-1">
              Our Journey
            </h2>
            <div className="w-14 h-0.5 bg-blue-600 mx-auto rounded-full" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 -translate-x-1/2" />
            {/* Mobile left line */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200" />

            <div className="space-y-4 md:space-y-0">
              {[
                { year: '2016', title: 'The Beginning', desc: 'Started Walnut Medical with a vision to make quality healthcare more accessible.', side: 'left' },
                { year: '2017', title: 'Neurorehab Expansion', desc: 'Launched Walkex Functional Treatment for Foot Drop and Stroke & Paralysis recovery.', side: 'right' },
                { year: '2018', title: 'R&D and Innovation', desc: 'Began Development Lab — Lower Limb GAIT Training Rehabilitation System.', side: 'left' },
                { year: '2019', title: 'R&D and Innovation', desc: 'Introduced IR Thermometer, Digital BP Monitor.', side: 'right' },
                { year: '2020', title: 'Respiratory Medical Devices', desc: 'Scaled Nebulizer, Oxygen Concentrator manufacturing.', side: 'left' },
                { year: '2021', title: 'Introduced Walnut Technologies', desc: 'Walnut Technologies — expanding beyond healthcare into full-spectrum electronics manufacturing.', side: 'right' },
                { year: '2022', title: 'Fintech Electronics', desc: 'Started Development of POS and Soundboxes for seamless Digital Transactions.', side: 'left' },
                { year: '2023', title: 'Mass Manufacturing', desc: 'Started mass-manufacturing of Soundbox to meet growing demand.', side: 'right' },
                { year: '2024', title: 'Terminal Managing System', desc: 'Launched End-to-End Software Eco-System for Payment Confirmation including MQTT broker and device firmware.', side: 'left' },
                { year: '2025', title: 'Automotive Electronics', desc: 'Started Smart Instrument Cluster vertical.', side: 'right' },
                { year: '2026', title: 'Consumer Electronics', desc: 'Scaling vertical of Consumer Electronics — IoT based.', side: 'left' },
              ].map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                  className={`relative flex items-center md:justify-center ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-4 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow -translate-x-1/2 z-10" />

                  {/* Content card */}
                  <div className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${item.side === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-1 md:justify-end" style={{ justifyContent: item.side === 'right' ? 'flex-start' : undefined }}>
                        <span className="text-lg font-black text-blue-600">{item.year}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">●</span>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-3 border-white shadow-lg z-10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DivisionsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const solutions = [
    {
      num: '01',
      title: 'Walk Lab',
      category: t('divisions.robotics'),
      desc: 'Advanced Rehabilitation & Gait Training Systems',
      image: '/neuro_rehab_device.webp',
      link: '/solutions?category=Neuro Rehab Devices',
    },
    {
      num: '02',
      title: 'Digital Blood Pressure',
      category: t('divisions.medical'),
      desc: 'ISO 13485, Class 10K Cleanroom, FDA Compliant',
      image: '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp',
      link: '/solutions?category=Medical',
    },
    {
      num: '03',
      title: 'Single Sim Model',
      category: t('divisions.fintech'),
      desc: 'NPCI, RBI, PCI DSS Certified',
      image: '/boxsound.webp',
      link: '/solutions?category=Fintech',
    },
    {
      num: '04',
      title: 'Cluster',
      category: t('divisions.automotive'),
      desc: 'Industrial & Automotive Electronics',
      image: '/cluster1.webp',
      link: '/solutions?category=Automotive',
    },
    {
      num: '05',
      title: 'IoT Smart Lock',
      category: t('divisions.iot'),
      desc: 'Connected Smart Devices & IoT Solutions',
      image: '/iot-lock-smart.webp',
      link: '/solutions?category=IoT',
    },
  ];

  return (
    <section id="divisions-preview" className="relative py-10 md:py-16 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2 block">Solutions</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-display leading-tight tracking-tight mb-3">
            <span className="text-slate-900">Technology That Powers </span>
            <span className="text-blue-600">Every Connection</span>
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            High-performance engineering solutions across industries, built for reliability, compliance, and scale.
          </p>
        </motion.div>

        {/* Solutions Grid - Full Images with Details Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.num}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Link
                to={sol.link}
                className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
              >
                  {/* Full Image */}
                  <div className="relative aspect-square overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={sol.image}
                      alt={sol.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                {/* Details Below Image */}
                <div className="p-4 border-t border-slate-100 flex-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">{sol.category}</span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">{sol.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">{sol.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const stats = [
    { value: '10+', label: t('stats.years') },
    { value: '400+', label: t('stats.engineers') },
    { value: '20+', label: t('stats.countries') },
    { value: '500K+', label: t('stats.units') },
    { value: '150,000 sq.ft', label: t('stats.facility') },
    { value: '4', label: t('stats.smt') },
  ];

  return (
    <section className="relative -mt-8 z-20">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.08 }}
              className="bg-white rounded-lg p-3 text-center shadow-lg border border-slate-100"
            >
              <div className="text-lg font-bold font-display text-blue-600 mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientsCertifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const certifications = [
    { title: 'ISO 13485', description: t('clients.qms') },
    { title: 'Class 10K Cleanroom', description: t('clients.cleanroom') },
    { title: 'CE, FCC, PCI-DSS', description: t('clients.standards') },
    { title: 'IEC 60601', description: t('clients.safety') },
    { title: 'BIS Certified', description: t('clients.indian') },
  ];

  const clients = [
    { name: t('clients.client1'), logo: '/clients/hdfc.webp' },
    { name: t('clients.client2'), logo: '/clients/sbi.webp' },
    { name: t('clients.client3'), logo: '/clients/paytm.webp' },
    { name: t('clients.client4'), logo: '/clients/bhartpe.webp' },
    { name: t('clients.client5'), logo: '/clients/apollo.webp' },
    { name: t('clients.client6'), logo: '/clients/indian-army.webp' },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-50/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-blue-300" />
            <span className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">
              {t('clients.trusted')}
            </span>
            <span className="w-8 h-px bg-blue-300" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-[#09244D] mb-3">
            Clients &{' '}
            <span className="text-blue-600">Certifications</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            {t('clients.subtitle')}
          </p>
        </motion.div>

        {/* Two Panel Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT PANEL — Certifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white rounded-2xl border border-[#E3EDF8] shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            {/* Panel Header */}
            <div className="p-5 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-[#09244D]">{t('clients.certifications')}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">We adhere to global standards for quality, safety and compliance.</p>
                </div>
              </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full whitespace-nowrap">
                Quality & Compliance
              </span>
            </div>

            {/* Certification Cards */}
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E3EDF8] hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center shrink-0 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                    <FiCheckCircle className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#09244D] leading-tight">{cert.title}</h4>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">{cert.description}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FiArrowRight className="w-3 h-3 text-slate-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT PANEL — Our Clients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white rounded-2xl border border-[#E3EDF8] shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            {/* Panel Header */}
            <div className="p-5 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-[#09244D]">{t('clients.clients')}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Collaborating with leading organizations across healthcare, finance and government sectors.</p>
                </div>
              </div>
                <span className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full whitespace-nowrap">
                Global Reach
              </span>
            </div>

            {/* Client Logos */}
            <div className="px-5 pb-5 grid grid-cols-3 sm:grid-cols-3 gap-4">
              {clients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  className="group flex items-center justify-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E3EDF8] hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-lg bg-white border border-[#E3EDF8] flex items-center justify-center overflow-hidden group-hover:border-blue-200 transition-colors duration-300">
                    <img src={client.logo} alt={client.name} width="96" height="96" className="w-full h-full object-contain" loading="lazy" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const trustItems = [
    { icon: FiShield, value: 'ISO 13485 Certified', desc: 'Quality management for medical devices' },
    { icon: FiGlobe, value: '20+ Countries', desc: 'Global supply chain and logistics' },
    { icon: FiTrendingUp, value: '99.8% Yield Rate', desc: 'Industry-leading manufacturing precision' },
  ];

  return (
    <section id="cta-section" className="py-10 md:py-12 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 border border-slate-200/60 shadow-sm">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 py-14 md:py-18 px-8 md:px-14">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-blue-600 font-bold text-[11px] uppercase tracking-widest mb-2 block">Let's Collaborate</span>
                  <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 leading-tight mb-4">
                    Ready to Build Your<br />Next Product?
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-md mb-8">
                    From concept to certification — we handle the entire manufacturing journey. ISO 13485 certified, 4 SMT lines, 500K+ units/month capacity.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-300"
                    >
                      Get in Touch
                      <FiArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => document.getElementById('divisions-preview')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300"
                    >
                      View Solutions
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-3">
                {trustItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.value}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                      className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.value}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
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

export default function HomePage({ onOpenSchedule }) {
  return (
    <div className="relative">
      <SEO
        title="Electronics for the World"
        description="Walnut Technologies - Vertically integrated OEM/ODM manufacturer serving medical devices, payment systems, and custom electronics. ISO 13485 certified, 500K+ units/month capacity in Mohali, Punjab, India."
        path="/"
        keywords="OEM, ODM, electronics manufacturer, medical devices, payment systems, POS terminals, oxygen concentrators, PCB design, SMT assembly, India"
      />
      <Hero onOpenSchedule={onOpenSchedule} />
      <DivisionsPreview />
      <JourneySection />
      <StatsSection />
      <ClientsCertifications />
      <CTASection />
    </div>
  );
}
