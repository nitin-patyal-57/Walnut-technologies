import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiShield, FiGlobe, FiArrowUpRight,
  FiZap, FiSearch, FiEdit3, FiLayers, FiSettings, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiActivity, FiAward, FiMail, FiSend, FiClock, FiTag,
  FiTarget, FiPenTool, FiBox, FiTool, FiPackage, FiUsers, FiStar, FiPhone, FiPlay
} from 'react-icons/fi';
import Hero from '../components/Hero';
import { useLanguage } from '../context/LanguageContext';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const processSteps = t('journey.processSteps');
  const processIcons = [FiSearch, FiPenTool, FiBox, FiCheckCircle, FiTool, FiPlay, FiCpu, FiShield, FiPackage, FiHeadphones];

  const processImages = [
    { image: '/Research & Market Analysis.webp', label: 'R&D' },
    { image: '/Design & Engineering.webp', label: 'Design' },
    { image: '/Prototype Development.webp', label: 'Prototype' },
    { image: '/Validation & Testing.webp', label: 'Testing' },
    { image: '/Manufacturing Engineering & Mold Design.webp', label: 'Tooling' },
    { image: '/Quality Assurance.webp', label: 'QC' },
    { image: '/Packaging & Dispatch.webp', label: 'Dispatch' },
  ];

  const companyJourney = [
    { year: '2016', title: t('journey.y2016Title'), desc: t('journey.y2016Desc'), icon: FiZap },
    { year: '2018', title: t('journey.y2018Title'), desc: t('journey.y2018Desc'), icon: FiEdit3 },
    { year: '2020', title: t('journey.y2020Title'), desc: t('journey.y2020Desc'), icon: FiCheckCircle },
    { year: '2022', title: t('journey.y2022Title'), desc: t('journey.y2022Desc'), icon: FiShield },
    { year: '2024', title: t('journey.y2024Title'), desc: t('journey.y2024Desc'), icon: FiHeadphones },
    { year: '2025', title: t('journey.y2025Title'), desc: t('journey.y2025Desc'), icon: FiTrendingUp },
  ];

  return (
    <section className="relative overflow-hidden" ref={ref}>
      {/* Factory Hero Section */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img src="/aboutbackground.webp" alt="Walnut Factory" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-3 block">Welcome to</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white leading-tight tracking-tight">
              OUR FACTORY
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Factory Images Row */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3">
            {['/contract manufacturing.webp', '/pcb.webp', '/Quality Assurance.webp'].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="relative h-[120px] md:h-[160px] rounded-xl overflow-hidden group"
              >
                <img src={img} alt="Factory" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Process - Hexagonal Grid */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-display text-slate-900 leading-tight mb-2">
              Production Process
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
          </motion.div>

          {/* Hexagonal Grid - Row 1 (3 items) */}
          <div className="flex justify-center gap-4 md:gap-6 mb-4">
            {processImages.slice(0, 3).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="relative group"
              >
                {/* Hexagon Container */}
                <div className="relative w-[140px] h-[160px] md:w-[180px] md:h-[200px]">
                  <svg viewBox="0 0 200 230" className="w-full h-full">
                    <defs>
                      <clipPath id={`hex-clip-${i}`}>
                        <polygon points="100,5 190,60 190,170 100,225 10,170 10,60" />
                      </clipPath>
                    </defs>
                    <polygon 
                      points="100,5 190,60 190,170 100,225 10,170 10,60" 
                      fill="white" 
                      stroke="#e2e8f0" 
                      strokeWidth="2"
                      className="group-hover:stroke-blue-400 transition-colors duration-300"
                    />
                    <image 
                      href={item.image} 
                      x="10" y="5" 
                      width="180" height="220" 
                      clipPath={`url(#hex-clip-${i})`}
                      className="group-hover:scale-110 transition-transform duration-500"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </svg>
                  
                  {/* Number Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                    0{i + 1}
                  </div>
                </div>
                
                {/* Label */}
                <p className="text-center text-sm font-semibold text-slate-700 mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Hexagonal Grid - Row 2 (4 items) */}
          <div className="flex justify-center gap-4 md:gap-6">
            {processImages.slice(3, 7).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="relative group"
              >
                {/* Hexagon Container */}
                <div className="relative w-[120px] h-[140px] md:w-[160px] md:h-[185px]">
                  <svg viewBox="0 0 200 230" className="w-full h-full">
                    <defs>
                      <clipPath id={`hex-clip2-${i}`}>
                        <polygon points="100,5 190,60 190,170 100,225 10,170 10,60" />
                      </clipPath>
                    </defs>
                    <polygon 
                      points="100,5 190,60 190,170 100,225 10,170 10,60" 
                      fill="white" 
                      stroke="#e2e8f0" 
                      strokeWidth="2"
                      className="group-hover:stroke-blue-400 transition-colors duration-300"
                    />
                    <image 
                      href={item.image} 
                      x="10" y="5" 
                      width="180" height="220" 
                      clipPath={`url(#hex-clip2-${i})`}
                      className="group-hover:scale-110 transition-transform duration-500"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </svg>
                  
                  {/* Number Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                    0{i + 4}
                  </div>
                </div>
                
                {/* Label */}
                <p className="text-center text-sm font-semibold text-slate-700 mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block">Our Journey</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-display text-slate-900 leading-tight">
              Building the <span className="text-blue-600">Future</span>
            </h2>
          </motion.div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {companyJourney.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                  className="group"
                >
                  <div className="relative bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full">
                    {/* Year */}
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full mb-3 shadow-md shadow-blue-500/20">
                      {item.year}
                    </span>
                    
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-snug">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
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
      image: '/neuro_rehab_device1.png',
      link: '/solutions?category=Neuro Rehab Devices',
    },
    {
      num: '02',
      title: 'Digital Blood Pressure',
      category: t('divisions.medical'),
      desc: 'ISO 13485, Class 10K Cleanroom, FDA Compliant',
      image: '/futuristic_medical_device_zoomed_out.png',
      link: '/solutions?category=Medical',
    },
    {
      num: '03',
      title: 'Single Sim Model',
      category: t('divisions.fintech'),
      desc: 'NPCI, RBI, PCI DSS Certified',
      image: '/boxsound.png',
      link: '/solutions?category=Fintech',
    },
    {
      num: '04',
      title: 'Cluster',
      category: t('divisions.automotive'),
      desc: 'Industrial & Automotive Electronics',
      image: '/cluster1.png',
      link: '/solutions?category=Automotive',
    },
    {
      num: '05',
      title: 'IoT Smart Lock',
      category: t('divisions.iot'),
      desc: 'Connected Smart Devices & IoT Solutions',
      image: '/IOT lock smart.png',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.num}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Link
                to={sol.link}
                className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500"
              >
                {/* Full Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Details Below Image */}
                <div className="p-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">{sol.category}</span>
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
    { name: t('clients.client1'), logo: '/clients/hdfc.jpeg' },
    { name: t('clients.client2'), logo: '/clients/sbi.jpeg' },
    { name: t('clients.client3'), logo: '/clients/paytm.jpeg' },
    { name: t('clients.client4'), logo: '/clients/bhartpe.jpeg' },
    { name: t('clients.client5'), logo: '/clients/apollo.jpeg' },
    { name: t('clients.client6'), logo: '/clients/indian army.jpeg' },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold mb-4">
            <FiShield className="w-4 h-4" />
            {t('clients.trusted')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            {t('clients.title')}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t('clients.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">{t('clients.certifications')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-500">{cert.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Clients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">{t('clients.clients')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {clients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                      <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                      <p className="text-xs text-slate-500">{t('clients.trusted')}</p>
                    </div>
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
    <section id="cta-section" className="py-16 md:py-20 bg-white">
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

export default function HomePage({ onOpenQuote, onOpenSchedule }) {
  return (
    <div className="relative">
      <Hero onOpenQuote={onOpenQuote} onOpenSchedule={onOpenSchedule} />
      <DivisionsPreview />
      <JourneySection />
      <StatsSection />
      <ClientsCertifications />
      <CTASection />
    </div>
  );
}
