import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiShield, FiGlobe, FiArrowUpRight,
  FiZap, FiSearch, FiEdit3, FiLayers, FiSettings, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiActivity, FiAward, FiMail, FiSend, FiClock, FiTag
} from 'react-icons/fi';
import Hero from '../components/Hero';
import { useLanguage } from '../context/LanguageContext';
import { news } from '../data/content';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const processImages = [
    '/Idea & Requirement.jpg',
    '/Research & Market Analysis.jpg',
    '/Design & Engineering.jpg',
    '/Prototype Development.jpg',
    '/Validation & Testing.jpg',
    '/Manufacturing Engineering & Mold Design.jpg',
    '/Quality Assurance.jpg',
    '/Packaging & Dispatch.jpg',
    '/After Sales Support.jpg',
    '/Continuous Improvement.jpg',
  ];

  const processCards = t('journey.processSteps').map((step, index) => ({
    step: index + 1,
    ...step,
    image: processImages[index],
  }));

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
    <section className="py-16 md:py-24 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 lg:gap-10">

          {/* ===== LEFT COLUMN ===== */}
          <div>

            {/* Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-[1.05] tracking-tight mb-4">
                <span className="text-slate-900">{t('journey.title')}</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg">
                {t('journey.subtitle')}
              </p>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-10"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/Research & Market Analysis.jpg"
                  alt="Industrial collaboration"
                  loading="lazy"
                  className="w-full h-[280px] md:h-[360px] object-cover"
                />
              </div>
            </motion.div>

            {/* Our Journey - Modern Vertical Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-10"
            >
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 mb-1">
                  {t('journey.journeyTitle')}
                </h2>
                <p className="text-sm text-slate-500">{t('journey.journeySubtitle')}</p>
              </div>

              <div className="relative">
                <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />

                <div className="space-y-5">
                  {companyJourney.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.06 }}
                        className="relative flex gap-4 md:gap-6"
                      >
                        <div className="flex-shrink-0 relative z-10">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                          </div>
                        </div>

                        <div className="flex-1 pb-1">
                          <div className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded-md">
                                    {item.year}
                                  </span>
                                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {item.title}
                                  </h3>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                                <FiArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="absolute left-[15px] md:left-[19px] -bottom-2 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* ===== RIGHT COLUMN - Journey in Detail ===== */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <div className="mb-5">
                <h2 className="text-base font-bold font-display text-slate-900 uppercase tracking-wider">
                  {t('journey.processTitle')}
                </h2>
              </div>

              <div className="space-y-3">
                {processCards.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    className="group flex items-stretch gap-0 rounded-xl border border-slate-100 bg-white overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      <div className="text-xs font-bold text-slate-400 mb-1">
                        {t('journey.stepLabel')} {item.step}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="w-[120px] md:w-[140px] flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function DivisionsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const divisionsData = [
    {
      id: 'medical',
      title: t('divisions.medical'),
      color: '#2563eb',
      icon: FiHeart,
      image: '/RTMS.png',
      features: t('divisions.medicalFeatures'),
      link: '/solutions?category=Medical',
    },
    {
      id: 'fintech',
      title: t('divisions.fintech'),
      color: '#7c3aed',
      icon: FiCreditCard,
      image: '/soundbox1.jpg',
      features: t('divisions.fintechFeatures'),
      link: '/solutions?category=Fintech',
    },
    {
      id: 'iot',
      title: t('divisions.iot'),
      color: '#0891b2',
      icon: FiWifi,
      image: '/IOT solutions.PNG',
      features: t('divisions.iotFeatures'),
      link: '/solutions?product=iot-smart-lock',
    },
    {
      id: 'robotics',
      title: t('divisions.robotics'),
      color: '#7c3aed',
      icon: FiActivity,
      image: '/walklab 3.0.jpeg',
      features: t('divisions.roboticsFeatures'),
      link: '/solutions?category=Neuro Rehab Devices',
    },
    {
      id: 'automotive',
      title: t('divisions.automotive'),
      color: '#059669',
      icon: FiCpu,
      image: '/cluster.png',
      features: t('divisions.automotiveFeatures'),
      link: '/solutions?category=Automotive',
    },
    {
      id: 'custom',
      title: t('divisions.custom'),
      color: '#d97706',
      icon: FiSettings,
      image: '/custom solutions.jpg',
      features: t('divisions.customFeatures'),
      link: '/solutions',
    },
  ];

  const trustBadges = [
    { icon: FiShield, title: t('divisions.quality'), description: t('divisions.qualityDesc') },
    { icon: FiAward, title: t('divisions.certified'), description: t('divisions.certifiedDesc') },
    { icon: FiTrendingUp, title: t('divisions.scalable'), description: t('divisions.scalableDesc') },
    { icon: FiHeadphones, title: t('divisions.support'), description: t('divisions.supportDesc') },
  ];

  return (
    <section id="divisions-preview" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 300C200 200 400 400 600 300C800 200 1000 400 1200 300C1400 200 1440 300 1440 300V0H0V300Z" fill="url(#wave)" />
          <defs>
            <linearGradient id="wave" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Network dots pattern */}
      <div className="absolute top-10 right-10 w-64 h-64 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="2" fill="#2563eb" />
          <circle cx="60" cy="40" r="2" fill="#2563eb" />
          <circle cx="100" cy="20" r="2" fill="#2563eb" />
          <circle cx="140" cy="60" r="2" fill="#7c3aed" />
          <circle cx="180" cy="30" r="2" fill="#7c3aed" />
          <circle cx="40" cy="80" r="2" fill="#2563eb" />
          <circle cx="80" cy="100" r="2" fill="#2563eb" />
          <circle cx="120" cy="80" r="2" fill="#7c3aed" />
          <circle cx="160" cy="120" r="2" fill="#7c3aed" />
          <circle cx="20" cy="140" r="2" fill="#2563eb" />
          <circle cx="60" cy="160" r="2" fill="#2563eb" />
          <circle cx="100" cy="140" r="2" fill="#7c3aed" />
          <circle cx="140" cy="180" r="2" fill="#7c3aed" />
          <circle cx="180" cy="160" r="2" fill="#7c3aed" />
          <line x1="20" y1="20" x2="60" y2="40" stroke="#2563eb" strokeWidth="0.5" opacity="0.3" />
          <line x1="60" y1="40" x2="100" y2="20" stroke="#2563eb" strokeWidth="0.5" opacity="0.3" />
          <line x1="100" y1="20" x2="140" y2="60" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3" />
          <line x1="40" y1="80" x2="80" y2="100" stroke="#2563eb" strokeWidth="0.5" opacity="0.3" />
          <line x1="80" y1="100" x2="120" y2="80" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="140" x2="60" y2="160" stroke="#2563eb" strokeWidth="0.5" opacity="0.3" />
          <line x1="60" y1="160" x2="100" y2="140" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t('nav.solutions')}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold font-display text-slate-900 mb-4 leading-tight">
            {t('divisions.title')}
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            {t('divisions.subtitle')}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
          {divisionsData.map((div, index) => (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
            >
              <Link
                to={div.link}
                className="group flex items-stretch bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[200px]"
              >
                {/* Content - Left Side */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${div.color}10`, border: `1px solid ${div.color}20` }}
                    >
                      <div.icon className="w-5 h-5" style={{ color: div.color }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3">
                      {div.title}
                    </h3>

                    {/* Features */}
                    <ul className="space-y-2">
                      {div.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <FiCheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Explore Link */}
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {t('divisions.explore')}
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                      <FiArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </span>
                  </div>
                </div>

                {/* Image - Right Side */}
                <div className="w-[140px] md:w-[160px] flex items-center justify-center shrink-0 bg-gradient-to-br from-slate-50 to-slate-100/50 p-4">
                  <img
                    src={div.image}
                    alt={div.title}
                    loading="lazy"
                    className="max-w-full max-h-[140px] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {trustBadges.map((badge, index) => {
            const BadgeIcon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.08 }}
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <BadgeIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">{badge.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
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
    { value: '300K+', label: t('stats.units') },
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
    t('clients.client1'),
    t('clients.client2'),
    t('clients.client3'),
    t('clients.client4'),
    t('clients.client5'),
    t('clients.client6'),
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
                  key={client}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
                      <FiGlobe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{client}</h4>
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
