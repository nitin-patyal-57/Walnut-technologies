import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, about, trustSignals } from '../data/content';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import {
  FiMapPin, FiMail, FiPhone, FiCalendar, FiGlobe, FiUsers, FiAward, FiCpu,
  FiArrowRight, FiTarget, FiEye, FiCheckCircle, FiZap, FiShield, FiHeart, FiClock
} from 'react-icons/fi';

const facilityImages = [
  '/futuristic_medical_device_zoomed_out.png',
  '/paytm soundbox.webp',
  '/neuro_rehab_device1.png',
  '/TDCS.webp',
  '/IOT lock smart.png',
  '/3d image.webp',
];

const valueIcons = [FiTarget, FiZap, FiGlobe, FiShield];

function ProcessTimeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const steps = [
    { num: '01', title: 'IDEA', image: '/Idea & Requirement.webp' },
    { num: '02', title: 'RESEARCH', image: '/Research & Market Analysis.webp' },
    { num: '03', title: 'DESIGN', image: '/Design & Engineering.webp' },
    { num: '04', title: 'MANUFACTURING', image: '/contract manufacturing.webp' },
    { num: '05', title: 'TESTING', image: '/Validation & Testing.webp' },
    { num: '06', title: 'MOLDING', image: '/Manufacturing Engineering & Mold Design.webp' },
    { num: '07', title: 'QA', image: '/Quality Assurance.webp' },
    { num: '08', title: 'PACKAGING', image: '/Packaging & Dispatch.webp' },
    { num: '09', title: 'SUPPORT', image: '/After Sales Support.webp' },
    { num: '10', title: 'IMPROVEMENT', image: '/Continuous Improvement.webp' },
  ];

  return (
    <section ref={ref} className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2 block">Our Process</span>
          <h2 className="text-3xl md:text-4xl font-black font-display leading-tight tracking-tight mb-3">
            <span className="text-slate-900">From concept to delivery, </span>
            <span className="text-blue-600">every step is crafted with precision.</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            End-to-end product development and manufacturing powered by an Industry 5.0 ecosystem.
          </p>
        </motion.div>

        {/* Process Grid - 5x2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square mb-3 shadow-md group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-sm font-black text-blue-400 block mb-0.5">{step.num}</span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{step.title}</h4>
                </div>
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
      <SEO
        title="About Us"
        description="Learn about Walnut Technologies - ISO 13485 certified OEM/ODM manufacturer with 15+ years experience, 500K+ units/month capacity, serving medical devices, payment systems, and custom electronics worldwide."
        path="/about"
        keywords="about walnut technologies, OEM manufacturer India, electronics manufacturing company, ISO 13485 certified"
      />
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/aboutbackground.webp"
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
                    src="/career background.webp"
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
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4">
                <FiHeart className="w-4 h-4" />
                {t('about.ourDna')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3">
                {t('about.capabilities')}
              </h2>
              <p className="text-slate-500 max-w-2xl">
                {t('about.capabilitiesDesc')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {about.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <AnimatedSection key={value.title} delay={i * 0.1}>
                  <div className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-500">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
