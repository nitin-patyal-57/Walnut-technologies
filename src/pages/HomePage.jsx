import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiArrowLeft, FiCheckCircle, FiArrowUpRight, FiStar,
  FiActivity, FiCpu, FiTool, FiHeart, FiThermometer,
  FiBox, FiPackage, FiCreditCard, FiShare2, FiMonitor, FiWifi
} from 'react-icons/fi';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import Picture from '../components/Picture';
import { scrollBehavior } from '../utils/motion';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const processImages = [
    { image: '/images/process/idea-and-requirement.webp', num: '01', from: 'IDEA', to: 'RESEARCH' },
    { image: '/images/process/research-and-market-analysis.webp', num: '02', from: 'RESEARCH', to: 'DESIGN' },
    { image: '/images/process/design-and-engineering.webp', num: '03', from: 'DESIGN', to: 'MANUFACTURING' },
    { image: '/images/process/manufacturing-engineering-and-mold-design.webp', num: '04', from: 'MANUFACTURING', to: 'TESTING' },
    { image: '/images/process/validation-and-testing.webp', num: '05', from: 'TESTING', to: 'MOLDING' },
    { image: '/images/process/prototype-development.webp', num: '06', from: 'MOLDING', to: 'QA' },
    { image: '/images/process/quality-assurance.webp', num: '07', from: 'QA', to: 'PACKAGING' },
    { image: '/images/process/packaging-and-dispatch.webp', num: '08', from: 'PACKAGING', to: 'SUPPORT' },
    { image: '/images/process/continuous-improvement.webp', num: '09', from: 'SUPPORT', to: 'IMPROVEMENT' },
    { image: '/images/process/after-sales-support.webp', num: '10', from: 'IMPROVEMENT', to: 'SUPPORT' },
  ];

  const milestones = [
    { year: '2016', title: 'The Beginning', desc: 'Started Walnut Medical with a vision to make quality healthcare more accessible.', icon: FiHeart, badgeColor: 'bg-blue-600' },
    { year: '2017', title: 'Neurorehab Expansion', desc: 'Launched Walkex Functional Treatment for Foot Drop and Stroke & Paralysis recovery.', icon: FiActivity, badgeColor: 'bg-emerald-600' },
    { year: '2018', title: 'R&D and Innovation', desc: 'Began Development Lab — Lower Limb GAIT Training Rehabilitation System.', icon: FiTool, badgeColor: 'bg-purple-600' },
    { year: '2019', title: 'OTC Devices', desc: 'Introduced IR Thermometer, Digital BP Monitor.', icon: FiThermometer, badgeColor: 'bg-amber-600' },
    { year: '2020', title: 'Scaling Manufacturing', desc: 'Scaled Nebulizer, Oxygen Concentrator manufacturing.', icon: FiBox, badgeColor: 'bg-cyan-600' },
    { year: '2021', title: 'Introducing Walnut Technologies', desc: 'Started non-medical applications, expanding our technology footprint beyond healthcare.', icon: FiCpu, badgeColor: 'bg-indigo-600' },
    { year: '2022', title: 'Fintech Integration', desc: 'Started Development of POS and Soundboxes for seamless Digital Transactions.', icon: FiCreditCard, badgeColor: 'bg-emerald-600' },
    { year: '2023', title: 'Mass Manufacturing', desc: 'Started mass-manufacturing of Soundbox to meet growing demand.', icon: FiPackage, badgeColor: 'bg-violet-600' },
    { year: '2024', title: 'Advanced Manufacturing', desc: 'Launched End-to-End Software Eco-System for Payment Confirmation including MQTT broker and device firmware.', icon: FiShare2, badgeColor: 'bg-sky-600', special: 'Major Scale Milestone' },
    { year: '2025', title: 'Electronics Manufacturing', desc: 'Started Smart Instrument Cluster vertical.', icon: FiMonitor, badgeColor: 'bg-rose-600' },
    { year: '2026', title: 'Smart Cluster', desc: 'Scaling vertical of Consumer Electronics — IoT based.', icon: FiWifi, badgeColor: 'bg-indigo-600' },
  ];

  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const prevIndex = (milestoneIndex - 1 + milestones.length) % milestones.length;
  const nextIndex = (milestoneIndex + 1) % milestones.length;
  const visibleMilestones = [
    { item: milestones[prevIndex], idx: prevIndex, position: 0 },
    { item: milestones[milestoneIndex], idx: milestoneIndex, position: 1 },
    { item: milestones[nextIndex], idx: nextIndex, position: 2 },
  ];

  const goPrev = () => setMilestoneIndex((milestoneIndex - 1 + milestones.length) % milestones.length);
  const goNext = () => setMilestoneIndex((milestoneIndex + 1) % milestones.length);
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

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
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">
              <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
              How We Work
              <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display text-slate-900 leading-tight">
              End-to-End <span className="text-blue-600">Production Process</span>
            </h2>
            <div className="w-14 h-0.5 bg-blue-600 mx-auto rounded-full mt-1.5" />
          </motion.div>

          {/* Circle Grid - Row 1 (5 items) */}
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4 mb-1 px-1">
            {processImages.slice(0, 5).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-center shrink-0"
              >
                <div className="relative group">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[130px] md:h-[130px] lg:w-[clamp(130px,calc((100vw_-_600px)/6),210px)] lg:h-[clamp(130px,calc((100vw_-_600px)/6),210px)] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw" 
                      src={item.image} 
                      alt={item.from}
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
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4 px-1">
            {processImages.slice(5, 10).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="flex items-center shrink-0"
              >
                <div className="relative group">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[130px] md:h-[130px] lg:w-[clamp(130px,calc((100vw_-_600px)/6),210px)] lg:h-[clamp(130px,calc((100vw_-_600px)/6),210px)] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw" 
                      src={item.image} 
                      alt={item.from}
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
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-3 md:py-4 overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-cyan-100/40 rounded-full blur-3xl" />

        <div className="relative mx-auto px-3 sm:px-5 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center mb-2 md:mb-3"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">
              <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
              Our Journey
              <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black font-display text-slate-900 leading-tight">
              From Walnut Medical to <span className="text-blue-600">Walnut Technologies</span>
            </h2>
          </motion.div>

          {/* Milestone Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="relative w-full max-w-5xl mx-auto flex items-center justify-center"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Company journey carousel"
          >
            {/* Previous Button */}
            <button
              onClick={goPrev}
              aria-label="Previous milestone"
              className="absolute -left-2 sm:-left-8 z-30 w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FiArrowLeft className="text-sm" />
            </button>

            {/* Cards */}
            <div className="w-full overflow-hidden py-2 px-2">
              <motion.div
                key={milestoneIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center justify-center gap-4 sm:gap-6"
              >
                {visibleMilestones.map(({ item, idx, position }) => {
                  const isCenter = position === 1;
                  return (
                    <div
                      key={idx}
                      onClick={position === 0 ? goPrev : position === 2 ? goNext : undefined}
                      className={`transition-all duration-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border ${
                        isCenter
                          ? 'w-full sm:w-[400px] bg-white border-blue-200 shadow-[0_30px_60px_-12px_rgba(37,99,235,0.18),0_0_2px_2px_rgba(37,99,235,0.12)] z-10 opacity-100'
                          : 'w-[260px] sm:w-[300px] bg-white/90 border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.04)] scale-95 opacity-60 hover:opacity-90 hidden md:flex cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3.5 py-1 text-xs font-extrabold text-white rounded-full shadow-sm ${item.badgeColor}`}>
                            {item.year}
                          </span>
                          {item.special && isCenter && (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full flex items-center">
                              <FiStar className="mr-1" /> {item.special}
                            </span>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 text-lg mb-3 shadow-inner">
                          <item.icon />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 tracking-tight">{item.title}</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span>Milestone #{idx + 1}</span>
                        <span className="text-blue-600">{isCenter ? 'Active View' : 'Click to View'}</span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Next Button */}
            <button
              onClick={goNext}
              aria-label="Next milestone"
              className="absolute -right-2 sm:-right-8 z-30 w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FiArrowRight className="text-sm" />
            </button>
          </motion.div>

          {/* Timeline Footer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-1 max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-2"
          >
            <div className="flex items-center justify-between w-full mb-1.5 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Journey Timeline</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                Milestone {milestoneIndex + 1} of {milestones.length}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 overflow-x-auto w-full py-0.5 scrollbar-hide">
              {milestones.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => setMilestoneIndex(idx)}
                  aria-label={`Go to milestone ${m.year}`}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                    idx === milestoneIndex
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {m.year}
                </button>
              ))}
            </div>
          </motion.div>
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
      image: '/images/products/neuro_rehab_device.webp',
      link: '/solutions?category=Neuro Rehab Devices',
      zoom: true,
      imgClass: 'object-[center_25%]',
    },
    {
      num: '02',
      title: 'Digital Blood Pressure',
      category: t('divisions.medical'),
      desc: 'ISO 13485, Class 10K Cleanroom, FDA Compliant',
      image: '/images/products/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.webp',
      link: '/solutions?category=Medical',
      zoom: true,
    },
    {
      num: '03',
      title: 'Single Sim Model',
      category: t('divisions.fintech'),
      desc: 'NPCI, RBI, PCI DSS Certified',
      image: '/images/products/boxsound.webp',
      link: '/solutions?category=Fintech',
    },
    {
      num: '04',
      title: 'Cluster',
      category: t('divisions.automotive'),
      desc: 'Industrial & Automotive Electronics',
      image: '/images/products/cluster1.webp',
      link: '/solutions?category=Automotive',
    },
    {
      num: '05',
      title: 'IoT Smart Lock',
      category: t('divisions.iot'),
      desc: 'Connected Smart Devices & IoT Solutions',
      image: '/images/products/iot-lock-smart.webp',
      link: '/solutions?category=IoT',
    },
  ];

  return (
    <section id="divisions-preview" className="relative pt-1 pb-6 md:pb-8 bg-white" ref={ref}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-5 md:mb-6 text-center"
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2 block">Solutions</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-display leading-tight tracking-tight mb-2">
            <span className="text-slate-900">Technology That Powers </span>
            <span className="text-blue-600">Every Connection</span>
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            High-performance engineering solutions across industries, built for reliability, compliance, and scale.
          </p>
        </motion.div>

        {/* Solutions Grid - Full Images with Details Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-stretch">
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
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 flex-shrink-0">
                  <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
                    src={sol.image}
                    alt={sol.title}
                    loading="lazy"
                    className={`w-full h-full object-cover ${sol.imgClass || 'object-center'} transition-transform duration-700 ${sol.zoom ? 'scale-[1.07] group-hover:scale-[1.14]' : 'group-hover:scale-110'}`}
                  />
                </div>

                {sol.sideImage ? (
                  <div className="flex flex-col sm:flex-row">
                  <div className="p-3 border-t border-slate-100 flex-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">{sol.category}</span>
                      <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">{sol.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">{sol.desc}</p>
                    </div>
                    <div className="w-full sm:w-40 h-32 sm:h-auto overflow-hidden border-t sm:border-t-0 sm:border-l border-slate-100 flex-shrink-0">
                      <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
                        src={sol.sideImage}
                        alt={`${sol.title} - Weebo`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-slate-100 flex-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">{sol.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">{sol.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug">{sol.desc}</p>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function HeroStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();

  const stats = [
    { value: '10+', label: t('stats.years') },
    { value: '600+', label: t('stats.engineers') },
    { value: '10+', label: t('stats.countries') },
    { value: '500K+', label: t('stats.units') },
    { value: '150,000 sq.ft', label: t('stats.facility') },
    { value: '4', label: t('stats.smt') },
  ];

  return (
    <section className="relative -mt-12 z-30">
      <div ref={ref} className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-slate-950/40"
        >
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${index > 0 ? 'md:border-l md:border-white/10' : ''}`}
              >
                <div className="text-lg font-bold font-display text-cyan-400 mb-0.5">{stat.value}</div>
                <div className="text-[10px] text-white/50 font-medium leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
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
    { name: t('clients.client1'), logo: '/images/clients/hdfc.webp' },
    { name: t('clients.client2'), logo: '/images/clients/sbi.webp' },
    { name: t('clients.client3'), logo: '/images/clients/paytm-logo.webp' },
    { name: t('clients.client4'), logo: '/images/clients/bhartpe.webp' },
    { name: t('clients.client5'), logo: '/images/clients/apollo.webp' },
    { name: t('clients.client6'), logo: '/images/clients/indian-army.webp' },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-50/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div ref={ref} className="relative mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="p-5 pb-4 flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Picture src="/images/logos/certificate.webp" alt="" width="44" height="44" sizes="44px" className="w-11 h-11 object-contain shrink-0" />
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
            <div className="p-5 pb-4 flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <Picture src="/images/logos/Clients.webp" alt="" width="44" height="44" sizes="44px" className="w-11 h-11 object-contain shrink-0" />
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
            <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {clients.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  className="group flex items-center justify-center p-2 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E3EDF8] hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className={`rounded-lg flex items-center justify-center overflow-hidden group-hover:border-blue-200 transition-colors duration-300 ${client.logo.includes('bhartpe') ? 'w-24 h-24 sm:w-36 sm:h-36' : 'w-16 h-16 sm:w-24 sm:h-24'}`}>
                    <Picture sizes="(max-width: 640px) 80px, 160px" src={client.logo} alt={client.name} width="96" height="96" className={`w-full h-full ${client.logo.includes('bhartpe') ? 'object-cover' : 'object-contain'}`} loading="lazy" />
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
    { logo: '/images/logos/certificate.webp', value: 'ISO 13485 Certified', desc: 'Quality management for medical devices' },
    { logo: '/images/logos/country.webp', value: '10+ Countries', desc: 'Global supply chain and logistics' },
    { logo: '/images/logos/rate.webp', value: '99.8% Yield Rate', desc: 'Industry-leading manufacturing precision' },
  ];

  return (
    <section id="cta-section" className="py-10 md:py-12 bg-white">
      <div ref={ref} className="mx-auto px-4 sm:px-6 lg:px-8">
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
                      onClick={() => document.getElementById('divisions-preview')?.scrollIntoView({ behavior: scrollBehavior() })}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-700 text-sm font-semibold rounded-xl transition-all duration-300"
                    >
                      View Solutions
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-3">
                {trustItems.map((item, index) => {
                  return (
                    <motion.div
                      key={item.value}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                      className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                    >
                      <Picture src={item.logo} alt="" width="48" height="48" sizes="48px" className="w-12 h-12 object-contain shrink-0" />
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
        description="Vertically integrated OEM/ODM manufacturer serving medical devices, payment systems and custom electronics. ISO 13485 certified, 500K+ units/month in India."
        path="/"
        keywords="OEM, ODM, electronics manufacturer, medical devices, payment systems, POS terminals, oxygen concentrators, PCB design, SMT assembly, India"
      />
      <Hero onOpenSchedule={onOpenSchedule} />
      <HeroStats />
      <DivisionsPreview />
      <JourneySection />
      <ClientsCertifications />
      <CTASection />
    </div>
  );
}
