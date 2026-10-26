import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiArrowLeft, FiCheckCircle, FiArrowUpRight, FiStar,
  FiAward, FiShield, FiZap,
  FiActivity, FiCpu, FiTool, FiHeart, FiThermometer,
  FiBox, FiPackage, FiCreditCard, FiShare2, FiMonitor, FiWifi
} from 'react-icons/fi';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import Picture from '../components/Picture';
import { journey, clientLogos, certifications as certificationList } from '../data/content';
import { scrollBehavior } from '../utils/motion';

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  // Production process photos: square-cropped + colour-graded for a consistent
  // blue Indian-manufacturing look. Files live in public/images/process/.
  const processImages = [
    { image: '/images/process/idea-and-requirement.webp', num: '01', from: 'IDEA', to: 'RESEARCH' },
    { image: '/images/process/research-and-market-analysis.webp', num: '02', from: 'RESEARCH', to: 'DESIGN' },
    { image: '/images/process/design-and-engineering.webp', num: '03', from: 'DESIGN', to: 'MANUFACTURING' },
    { image: '/images/process/manufacturing-engineering-and-mold-design.webp', num: '04', from: 'MANUFACTURING', to: 'TESTING' },
    { image: '/images/process/validation-and-testing.webp', num: '05', from: 'TESTING', to: 'MOLDING' },
    { image: '/images/process/prototype-development.webp', num: '06', from: 'MOLDING', to: 'QA' },
    { image: '/images/process/quality-assurance.webp', num: '07', from: 'QA', to: 'PACKAGING' },
    { image: '/images/process/packaging-and-dispatch.webp', num: '08', from: 'PACKAGING', to: 'SUPPORT' },
    { image: '/images/process/after-sales-support.webp', num: '09', from: 'SUPPORT', to: 'IMPROVEMENT' },
    { image: '/images/process/continuous-improvement.webp', num: '10', from: 'IMPROVEMENT', to: 'SUPPORT' },
  ];

  // Milestones come from the admin panel (Company > Our Journey), so adding
  // next year is done there without a code change. Icons are not editable -
  // they cycle through this list by position.
  const MILESTONE_ICONS = [
    FiHeart, FiActivity, FiTool, FiThermometer, FiBox, FiCpu,
    FiCreditCard, FiPackage, FiShare2, FiMonitor, FiWifi,
  ];
  const milestones = journey.map((m, i) => ({
    ...m,
    desc: m.description,
    icon: MILESTONE_ICONS[i % MILESTONE_ICONS.length],
  }));

  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const pillsRef = useRef(null);
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

  useEffect(() => {
    const track = pillsRef.current;
    const btn = track?.children[milestoneIndex];
    if (!track || !btn) return;
    const target = btn.offsetLeft - (track.clientWidth - btn.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [milestoneIndex]);

  // An emptied list in the admin hides the section rather than crashing on
  // milestones[0] below.
  if (!milestones.length) return null;

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
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[130px] md:h-[130px] lg:w-[clamp(130px,calc((100vw_-_400px)/5.5),320px)] lg:h-[clamp(130px,calc((100vw_-_400px)/5.5),320px)] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw" 
                      src={item.image} 
                      alt={item.from}
                      width="150"
                      height="150"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-blue-600 text-white text-[10px] sm:text-[10px] md:text-[10px] font-bold flex items-center justify-center shadow-md z-10">
                      {item.num}
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm font-bold text-slate-900 leading-tight">{item.from}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex items-center mx-0.5 sm:mx-1 md:mx-2 lg:mx-3 -mt-3 md:-mt-4">
                    <div className="w-2 sm:w-3 md:w-6 lg:w-8 h-[1.5px] bg-blue-400" />
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
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-[130px] md:h-[130px] lg:w-[clamp(130px,calc((100vw_-_400px)/5.5),320px)] lg:h-[clamp(130px,calc((100vw_-_400px)/5.5),320px)] rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-400 transition-colors duration-300">
                    <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw" 
                      src={item.image} 
                      alt={item.from}
                      width="150"
                      height="150"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full bg-blue-600 text-white text-[10px] sm:text-[10px] md:text-[10px] font-bold flex items-center justify-center shadow-md z-10">
                      {item.num}
                    </div>
                  </div>
                  <div className="text-center mt-1">
                    <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm font-bold text-slate-900 leading-tight">{item.from}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex items-center mx-0.5 sm:mx-1 md:mx-2 lg:mx-3 -mt-3 md:-mt-4">
                    <div className="w-2 sm:w-3 md:w-6 lg:w-8 h-[1.5px] bg-blue-400" />
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
            className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Company journey carousel"
          >
            {/* Previous Button */}
            <button
              onClick={goPrev}
              aria-label="Previous milestone"
              className="absolute -left-2 sm:-left-5 z-30 w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="flex items-center justify-center gap-4 sm:gap-6 xl:gap-8"
              >
                {visibleMilestones.map(({ item, idx, position }) => {
                  const isCenter = position === 1;
                  return (
                    <div
                      key={idx}
                      onClick={position === 0 ? goPrev : position === 2 ? goNext : undefined}
                      className={`transition-all duration-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between border ${
                        isCenter
                          ? 'w-full sm:w-[400px] xl:w-[460px] 2xl:w-[520px] bg-white border-blue-200 shadow-[0_30px_60px_-12px_rgba(37,99,235,0.18),0_0_2px_2px_rgba(37,99,235,0.12)] z-10 opacity-100'
                          : 'w-[240px] xl:w-[300px] 2xl:w-[360px] bg-white/90 border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.04)] scale-95 opacity-60 hover:opacity-90 hidden lg:flex cursor-pointer'
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
              className="absolute -right-2 sm:-right-5 z-30 w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FiArrowRight className="text-sm" />
            </button>
          </motion.div>

          {/* Timeline Footer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-1 max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-2"
          >
            <div className="flex items-center justify-between w-full mb-1.5 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Journey Timeline</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                Milestone {milestoneIndex + 1} of {milestones.length}
              </span>
            </div>
            <div ref={pillsRef} className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto w-full py-0.5 scrollbar-hide">
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
      image: '/images/products/neuro_rehab_device-home.webp',
      link: '/solutions?category=Neuro Rehab Devices',
    },
    {
      num: '02',
      title: 'Digital Blood Pressure',
      category: t('divisions.medical'),
      desc: 'ISO 13485 Certified, Made in India',
      image: '/images/products/bp-home.webp',
      link: '/solutions?category=Medical',
    },
    {
      num: '03',
      title: 'Single Sim Model',
      category: t('divisions.fintech'),
      desc: 'NPCI, RBI, PCI DSS Certified',
      image: '/images/products/boxsound-home.webp',
      link: '/solutions?category=Fintech',
    },
    {
      num: '04',
      title: 'Cluster',
      category: t('divisions.automotive'),
      desc: 'Industrial & Automotive Electronics',
      image: '/images/products/cluster1-home.webp',
      link: '/solutions?category=Automotive',
    },
    {
      num: '05',
      title: 'IoT Smart Lock',
      category: t('divisions.iot'),
      desc: 'Connected Smart Devices & IoT Solutions',
      image: '/images/products/iot-lock-smart-home.webp',
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
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
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
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  // Certifications and client logos are maintained in the admin panel
  // (Clients & Resources), so both rows update without a code change. In the
  // stamp, `code` is the short form inside the circle; `title`/`description`
  // sit under it.
  const certifications = certificationList;
  const clients = clientLogos;

  // Split 'Clients & Certifications' on the ampersand so both halves stay
  // translated. The accent keeps the '&' — slicing it out and rendering the
  // two halves either side of a space dropped it from the heading entirely.
  const rawTitle = t('clients.title');
  const amp = rawTitle.indexOf('&');
  const headingLead = amp === -1 ? rawTitle : rawTitle.slice(0, amp).trim();
  const headingAccent = amp === -1 ? '' : rawTitle.slice(amp).trim();

  return (
    <section className="relative py-7 md:py-9 overflow-hidden bg-white">
      <div ref={ref} className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-[#E3EDF8] bg-white p-4 sm:p-5 shadow-[0_4px_40px_rgba(9,36,77,0.06)]"
        >
          {/* Certificate framing: inner rule + four corner brackets */}
          <div className="pointer-events-none absolute inset-[7px] rounded-[18px] border border-[#EEF5FD]" />
          <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-blue-300/70" />
          <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-blue-300/70" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-blue-300/70" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-blue-300/70" />

          <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)] lg:gap-8">
            {/* LEFT — the statement */}
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-8 bg-blue-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
                  {t('clients.trusted')}
                </span>
              </div>
              <h2 className="text-2xl md:text-[30px] font-bold font-display leading-[1.1] text-[#09244D]">
                {headingLead} <span className="text-blue-600">{headingAccent}</span>
              </h2>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-slate-500">{t('clients.subtitle')}</p>
              <button
                type="button"
                onClick={() => document.getElementById('our-clients')?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' })}
                className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50"
              >
                {t('clients.explore')}
                <FiArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* RIGHT — certification stamps. One row at lg: five tiles must fit
                the right column, otherwise the wrap to 3+2 doubles this block's
                height and pushes the logo wall off a single screen. */}
            <div className={`flex flex-wrap justify-center gap-x-2 gap-y-4 sm:gap-x-3 lg:flex-nowrap lg:gap-x-3 ${certifications.length ? '' : 'hidden'}`}>
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="group w-[92px] shrink-0 text-center sm:w-[104px] lg:w-[110px]"
                >
                  <div className="relative mx-auto h-16 w-16 transition-transform duration-300 group-hover:-translate-y-1 sm:h-[76px] sm:w-[76px] lg:h-20 lg:w-20">
                    {/* stamp disc */}
                    <div className="absolute inset-0 rounded-full border border-blue-200 bg-gradient-to-br from-white via-white to-[#EAF3FF] shadow-[0_3px_14px_rgba(37,99,235,0.12)] transition-all duration-300 group-hover:border-blue-300 group-hover:shadow-[0_8px_22px_rgba(37,99,235,0.20)]" />
                    {/* inner rule */}
                    <div className="absolute inset-[15%] rounded-full border border-blue-100" />
                    {/* perforated ring */}
                    <motion.div
                      className="absolute inset-[6%]"
                      animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                      transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
                        <circle
                          cx="50"
                          cy="50"
                          r="47"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="2.2"
                          strokeDasharray="1.4 7"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                    {/* centre */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-base font-bold text-[#09244D] sm:text-lg">{cert.code}</span>
                      <span className="mt-1 h-px w-8 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                    </div>
                  </div>

                  <h3 className="mt-2 text-[12px] font-bold font-display leading-tight text-[#09244D] transition-colors duration-300 group-hover:text-blue-600">
                    {cert.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{cert.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* BOTTOM — client logo wall */}
          <div id="our-clients" className={`relative mt-5 rounded-2xl border border-[#E3EDF8] bg-white px-4 py-3 sm:px-5 ${clients.length ? '' : 'hidden'}`}>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {t('clients.clients')}
              </span>
              <span className="h-px flex-1 bg-[#E3EDF8]" />
            </div>
            {/* Continuous right-to-left marquee. The row is rendered twice and
                shifted by exactly -50%, so it loops with no seam. Spacing is a
                margin on each tile rather than a flex gap — a gap would leave
                the two halves half a gutter out of step and visibly jump. */}
            <div className="marquee-group relative mt-3 overflow-hidden">
              <div
                className={`marquee-mask flex w-max items-center ${
                  reduceMotion ? '' : 'animate-marquee-left'
                }`}
              >
                {[...clients, ...clients].map((client, index) => (
                  <div
                    key={`${client.name}-${index}`}
                    aria-hidden={index >= clients.length}
                    className="group mr-2 flex h-14 w-[136px] shrink-0 items-center justify-center rounded-xl border border-transparent bg-white px-2 shadow-[0_1px_6px_rgba(9,36,77,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_6px_18px_rgba(37,99,235,0.14)] sm:mr-3 sm:h-16 sm:w-[164px]"
                  >
                    <Picture
                      src={client.logo}
                      alt={client.name}
                      sizes="164px"
                      loading="lazy"
                      className={`max-w-full object-contain opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 ${
                        client.logo.includes('bhartpe')
                          ? 'max-h-14 sm:max-h-16'
                          : 'max-h-10 sm:max-h-12'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
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
