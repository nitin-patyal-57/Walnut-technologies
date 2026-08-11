import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, about, trustSignals } from '../data/content';
import { useLanguage } from '../context/LanguageContext';
import {
  FiMapPin, FiMail, FiPhone, FiCalendar, FiGlobe, FiUsers, FiAward, FiCpu,
  FiArrowRight, FiTarget, FiEye, FiCheckCircle, FiZap, FiShield, FiHeart, FiClock
} from 'react-icons/fi';

const facilityImages = [
  '/RTMS.png',
  '/paytm soundbox.png',
  '/walklab 3.0.jpeg',
  '/TDCS.png',
  '/smart lock.PNG',
  '/3d image.png',
];

const valueIcons = [FiTarget, FiZap, FiGlobe, FiShield];

function ProcessTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLanguage();

  const processSteps = t('about.processSteps');
  const steps = processSteps.map((s, i) => ({
    id: i + 1,
    step: s.step,
    title: s.title,
    description: s.description,
    image: ['/Idea & Requirement.jpg', '/Research & Market Analysis.jpg', '/Design & Engineering.jpg', '/Prototype Development.jpg', '/Validation & Testing.jpg', '/Manufacturing Engineering & Mold Design.jpg', '/Quality Assurance.jpg', '/Packaging & Dispatch.jpg', '/After Sales Support.jpg', '/Continuous Improvement.jpg'][i],
    color: ['#1e40af', '#2563eb', '#0284c7', '#0891b2', '#0d9488', '#059669', '#16a34a', '#4d7c0f', '#65a30d', '#84cc16'][i],
  }));

  return (
    <section ref={ref} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">
            {t('about.ourProcess')}
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            {t('about.processSubtitle')}
          </p>
        </motion.div>

        {/* Zigzag Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Top Row - Steps 1, 3, 5, 7, 9 */}
          <div className="flex justify-between px-[2%] mb-4">
            {steps.filter((_, i) => i % 2 === 0).map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: -30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="w-[16%] text-center"
              >
                <p className="text-xs font-bold tracking-widest text-slate-400 mb-1">{step.step}</p>
                <h3 className="text-base font-bold mb-1" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Diamond Cards Row */}
          <div className="relative h-[300px]">
            {/* Zigzag Ribbon SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="20%" stopColor="#2563eb" />
                  <stop offset="40%" stopColor="#0891b2" />
                  <stop offset="60%" stopColor="#0d9488" />
                  <stop offset="80%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#84cc16" />
                </linearGradient>
                <filter id="ribbonShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2" />
                </filter>
              </defs>
              <motion.path
                d="M 0 50 L 100 250 L 200 50 L 300 250 L 400 50 L 500 250 L 600 50 L 700 250 L 800 50 L 900 250 L 1000 50"
                fill="none"
                stroke="url(#ribbonGrad)"
                strokeWidth="40"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ribbonShadow)"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>

            {/* Diamond Cards positioned at vertices */}
            {steps.map((step, index) => {
              const isTop = index % 2 === 0;
              const leftPercent = (index / (steps.length - 1)) * 90 + 5;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.08, type: 'spring' }}
                  className="absolute z-10"
                  style={{
                    left: `${leftPercent}%`,
                    top: isTop ? '10px' : '160px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="w-[100px] h-[100px] rounded-2xl bg-white shadow-xl overflow-hidden cursor-pointer border-2"
                    style={{ boxShadow: `0 8px 30px ${step.color}30`, borderColor: `${step.color}30` }}
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Row - Steps 2, 4, 6, 8, 10 */}
          <div className="flex justify-between px-[7%] mt-4">
            {steps.filter((_, i) => i % 2 === 1).map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="w-[16%] text-center"
              >
                <p className="text-xs font-bold tracking-widest text-slate-400 mb-1">{step.step}</p>
                <h3 className="text-base font-bold mb-1" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zigzag Timeline - Mobile */}
        <div className="lg:hidden">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.06 }}
              className={`flex items-center gap-4 mb-5 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border-2"
                style={{ borderColor: `${step.color}30` }}
              >
                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
              </motion.div>
              <div className={index % 2 === 0 ? 'text-left' : 'text-right'}>
                <p className="text-xs font-bold tracking-widest text-slate-400">{step.step}</p>
                <h3 className="text-sm font-bold" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/aboutbackground.png"
            alt="Walnut Technologies Facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
        </div>

        {/* Content */}
        <div ref={ref} className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('about.est')} {brand.founded}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl md:text-5xl font-bold font-display text-white mb-5 leading-tight"
            >
              {t('about.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-base text-white/70 mb-7 leading-relaxed"
            >
              {t('about.story')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300">
                {t('about.getInTouch')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/solutions" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors duration-300">
                {t('about.ourSolutions')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="bg-white rounded-lg p-3 text-center shadow-lg border border-slate-100"
                >
                  <div className="text-lg font-bold font-display text-blue-600 mb-0.5">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision with Image */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <AnimatedSection>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/career background.jpg"
                    alt="Manufacturing Facility"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                </div>
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-5 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FiCpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">{t('about.facilitySize')}</div>
                      <div className="text-xs text-slate-500">{t('about.stateOfTheArt')}</div>
                    </div>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-20 blur-xl" />
              </div>
            </AnimatedSection>

            {/* Content Side */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-3">
                    <FiTarget className="w-4 h-4" />
                    {t('about.ourPurpose')}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                    {t('about.missionVision')}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50/30 border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FiTarget className="w-4 h-4" />
                      {t('about.missionTitle')}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{about.mission}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50/30 border border-emerald-100">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FiEye className="w-4 h-4" />
                      {t('about.visionTitle')}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{about.vision}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Company Details + Certifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Company Info */}
            <AnimatedSection>
              <div className="h-full">
                <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold mb-3">
                  <FiAward className="w-4 h-4" />
                  {t('about.companyInfo')}
                </div>
                <h2 className="text-3xl font-bold font-display text-slate-900 mb-8">
                  {t('about.trustedSince')}{' '}
                  <span className="text-blue-600">{brand.founded}</span>
                </h2>

                <div className="space-y-4">
                  {[
                    { icon: FiAward, label: t('about.legalName'), value: brand.fullName },
                    { icon: FiCalendar, label: t('about.founded'), value: brand.founded },
                    { icon: FiMapPin, label: t('about.headquarters'), value: brand.location },
                    { icon: FiUsers, label: t('about.gstn'), value: brand.gstn },
                    { icon: FiCpu, label: t('about.facility'), value: t('about.facilityValue') },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-sm text-slate-700">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Certifications */}
            <AnimatedSection delay={0.2}>
              <div className="h-full">
                <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-3">
                  <FiShield className="w-4 h-4" />
                  {t('about.qualityCompliance')}
                </div>
                <h2 className="text-3xl font-bold font-display text-slate-900 mb-8">
                  <span className="text-emerald-600">{t('about.certifiedExcellence')}</span>
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {trustSignals.certifications.map((cert, i) => (
                    <motion.div
                      key={cert}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                      className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FiCheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{cert}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
                  <h3 className="text-white font-bold mb-2">{t('about.readyToPartner')}</h3>
                  <p className="text-white/60 text-sm mb-4">{t('about.partnerDesc')}</p>
                   <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors duration-300">
                    {t('about.contactUs')}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold mb-4">
                <FiHeart className="w-4 h-4" />
                {t('about.ourDna')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
                {t('about.capabilities')}
              </h2>
              <p className="text-white/50 max-w-2xl">
                {t('about.capabilitiesDesc')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <AnimatedSection key={value.title} delay={i * 0.1}>
                  <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50/30 border border-blue-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                  {t('about.letsBuild').split(' Great')[0]}{' '}
                  <span className="text-blue-600">{t('about.letsBuild').split(' Great')[1] || 'Great Together'}</span>
                </h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                  {t('about.letsBuildDesc')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300">
                    {t('about.startProject')}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/process" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-semibold transition-colors duration-300">
                    {t('about.ourProcess')}
                  </Link>
                </div>
              </div>
            </div>
           </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
