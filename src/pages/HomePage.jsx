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
import { news } from '../data/content';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const processSteps = t('journey.processSteps');
  const leftSteps = processSteps.slice(0, 5);
  const rightSteps = processSteps.slice(5, 10);

  const leftIcons = [FiSearch, FiPenTool, FiBox, FiCheckCircle, FiTool];
  const rightIcons = [FiPlay, FiCpu, FiShield, FiPackage, FiHeadphones];

  const companyJourney = [
    { year: '2016', title: t('journey.y2016Title'), description: t('journey.y2016Desc'), icon: FiZap },
    { year: '2017', title: t('journey.y2017Title'), description: t('journey.y2017Desc'), icon: FiSearch },
    { year: '2018', title: t('journey.y2018Title'), description: t('journey.y2018Desc'), icon: FiEdit3 },
    { year: '2019', title: t('journey.y2019Title'), description: t('journey.y2019Desc'), icon: FiLayers },
    { year: '2020', title: t('journey.y2020Title'), description: t('journey.y2020Desc'), icon: FiCheckCircle },
    { year: '2021', title: t('journey.y2021Title'), description: t('journey.y2021Desc'), icon: FiSettings },
    { year: '2022', title: t('journey.y2022Title'), description: t('journey.y2022Desc'), icon: FiShield },
    { year: '2023', title: t('journey.y2023Title'), description: t('journey.y2023Desc'), icon: FiTruck },
    { year: '2024', title: t('journey.y2024Title'), description: t('journey.y2024Desc'), icon: FiHeadphones },
    { year: '2025', title: t('journey.y2025Title'), description: t('journey.y2025Desc'), icon: FiTrendingUp },
  ];

  return (
    <section className="py-12 md:py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Approach + Process */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-6 mb-12">

          {/* ===== LEFT: OUR APPROACH ===== */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block">
                Our Approach
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-black font-display leading-[1.08] tracking-tight mb-4">
                <span className="text-slate-900">FROM IDEA TO </span>
                <span className="text-blue-600">LARGE SCALE.</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
                End-to-end product development and manufacturing powered by an Industry 5.0 ecosystem.
              </p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/Research & Market Analysis.webp"
                  alt="Our team collaboration"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT: OUR PROCESS WHEEL ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block text-center lg:text-left">
              Our Process
            </span>

            <div className="relative flex items-start gap-4">

              {/* Left Process Steps */}
              <div className="flex-1 flex flex-col gap-3 pt-2">
                {leftSteps.map((step, i) => {
                  const Icon = leftIcons[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[10px] font-bold text-blue-600 mb-0.5">
                          0{i + 1}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Center Circle - IDEA TO IMPACT */}
              <div className="hidden md:flex flex-col items-center justify-center shrink-0 pt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative w-40 h-40 lg:w-48 lg:h-48"
                >
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-200" />
                  {/* Inner circle */}
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex flex-col items-center justify-center shadow-lg shadow-blue-100/50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <FiTarget className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider text-center leading-tight">
                      IDEA TO<br/>IMPACT
                    </span>
                  </div>
                  {/* Connecting dots */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-2 h-2 rounded-full bg-blue-400"
                      style={{
                        top: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                        left: `${50 + 48 * Math.cos((deg * Math.PI) / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Right Process Steps */}
              <div className="flex-1 flex flex-col gap-3 pt-2">
                {rightSteps.map((step, i) => {
                  const Icon = rightIcons[i];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      className="flex items-start gap-3 group text-right flex-row-reverse"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[10px] font-bold text-blue-600 mb-0.5">
                          0{i + 6}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-0.5">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </motion.div>

        </div>

        {/* ===== OUR JOURNEY - Horizontal Timeline ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 block">
            Our Journey
          </span>

          <div className="relative overflow-x-auto pb-4 -mx-4 px-4">
            {/* Timeline line */}
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            <div className="flex gap-0 min-w-max relative">
              {companyJourney.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    className="flex flex-col items-center w-[120px] lg:w-[130px] relative"
                  >
                    {/* Dot */}
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-4 border-white shadow-md z-10 mt-3" />

                    {/* Content */}
                    <div className="mt-3 text-center px-1">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 block mb-0.5">{item.year}</span>
                      <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

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
      title: t('divisions.medical'),
      color: '#2563eb',
      icon: FiHeart,
      image: '/RTMS.webp',
      link: '/solutions?category=Medical',
    },
    {
      num: '02',
      title: t('divisions.fintech'),
      color: '#7c3aed',
      icon: FiCreditCard,
      image: '/soundbox1.webp',
      link: '/solutions?category=Fintech',
    },
    {
      num: '03',
      title: t('divisions.iot'),
      color: '#0891b2',
      icon: FiWifi,
      image: '/IOT solutions.webp',
      link: '/solutions?category=IoT',
    },
    {
      num: '04',
      title: t('divisions.robotics'),
      color: '#7c3aed',
      icon: FiActivity,
      image: '/walklab 3.0.webp',
      link: '/solutions?category=Neuro Rehab Devices',
    },
    {
      num: '05',
      title: t('divisions.automotive'),
      color: '#059669',
      icon: FiCpu,
      image: '/cluster.webp',
      link: '/solutions?category=Automotive',
    },
    {
      num: '06',
      title: t('divisions.custom'),
      color: '#d97706',
      icon: FiSettings,
      image: '/custom solutions.webp',
      link: '/solutions',
    },
  ];

  const trustBadges = [
    { icon: FiShield, title: t('divisions.quality'), desc: t('divisions.qualityDesc') },
    { icon: FiAward, title: t('divisions.certified'), desc: t('divisions.certifiedDesc') },
    { icon: FiTrendingUp, title: t('divisions.scalable'), desc: t('divisions.scalableDesc') },
    { icon: FiHeadphones, title: t('divisions.support'), desc: t('divisions.supportDesc') },
  ];

  return (
    <section id="divisions-preview" className="relative py-6 md:py-10 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-1 block">Solutions</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display leading-tight tracking-tight mb-2">
            <span className="text-slate-900">Technology That Powers </span>
            <span className="text-blue-600">Every Connection</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            High-performance engineering solutions across industries, built for reliability, compliance, and scale.
          </p>
        </motion.div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.num}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Link
                to={sol.link}
                className="group flex items-center gap-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 p-3"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={sol.image} alt={sol.title} loading="lazy" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${sol.color}10`, border: `1px solid ${sol.color}20` }}>
                    <sol.icon className="w-3.5 h-3.5" style={{ color: sol.color }} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold" style={{ color: sol.color }}>{sol.num}</span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">{sol.title}</h4>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Center Badge + Trust Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Center Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl px-4 py-3 shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <FiAward className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-tight block">End-to-End</span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider leading-tight block">Engineering Excellence</span>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 w-full">
            {trustBadges.map((badge, index) => {
              const BadgeIcon = badge.icon;
              return (
                <motion.div
                  key={badge.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.06 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <BadgeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-900 leading-tight">{badge.title}</h4>
                    <p className="text-[9px] text-slate-500 leading-snug">{badge.desc}</p>
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
    { name: t('clients.client1'), logo: '/clients/hdfc-bank.svg' },
    { name: t('clients.client2'), logo: '/clients/sbi.svg' },
    { name: t('clients.client3'), logo: '/clients/paytm.svg' },
    { name: t('clients.client4'), logo: '/clients/bharatpe.svg' },
    { name: t('clients.client5'), logo: '/clients/apollo.svg' },
    { name: t('clients.client6'), logo: '/clients/indian-army.svg' },
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
                    <div className="w-16 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
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

  const whyChooseUs = [
    { icon: FiShield, title: t('cta.wcu1Title'), desc: t('cta.wcu1Desc') },
    { icon: FiGlobe, title: t('cta.wcu2Title'), desc: t('cta.wcu2Desc') },
    { icon: FiCheckCircle, title: t('cta.wcu3Title'), desc: t('cta.wcu3Desc') },
  ];

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
                    {t('cta.title')}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">
                    {t('cta.subtitle')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300"
                    >
                      {t('cta.touch')}
                      <FiArrowUpRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => document.getElementById('divisions-preview')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      {t('cta.solutions')}
                    </button>
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
                      <div className="text-xs text-slate-400">{item.desc}</div>
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
