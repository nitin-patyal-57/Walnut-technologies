import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  FiBriefcase, FiUsers, FiTrendingUp, FiGlobe, FiZap,
  FiArrowRight, FiBookOpen, FiAward, FiSearch,
  FiCpu, FiCode, FiLayers, FiSettings, FiMonitor,
  FiTool, FiCheckSquare, FiUser
} from 'react-icons/fi';

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

export default function CareerPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();
  const [activeDept, setActiveDept] = useState('All Departments');
  const [activeLocation, setActiveLocation] = useState('All Locations');
  const [activeExperience, setActiveExperience] = useState('All Experience');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [t('careerExtended.departments.all'), t('careerExtended.departments.rnd'), t('careerExtended.departments.software'), t('careerExtended.departments.manufacturing'), t('careerExtended.departments.quality'), t('careerExtended.departments.mechanical')];
  const locations = [t('careerExtended.locations.all'), t('careerExtended.locations.mohali')];
  const experiences = [t('careerExtended.experiences.all'), t('careerExtended.experiences.fresher'), t('careerExtended.experiences.oneToThree'), t('careerExtended.experiences.threeToFive'), t('careerExtended.experiences.fivePlus')];

  const jobOpenings = [
    {
      key: 'softwareEngineer',
      title: t('careerExtended.jobs.softwareEngineer.title'),
      department: t('careerExtended.departments.software'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹8-16 LPA',
      description: t('careerExtended.jobs.softwareEngineer.description'),
      tags: ['React', 'Node.js', 'Python'],
      icon: FiCode,
    },
    {
      key: 'embeddedEngineer',
      title: t('careerExtended.jobs.embeddedEngineer.title'),
      department: t('careerExtended.departments.rnd'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹10-18 LPA',
      description: t('careerExtended.jobs.embeddedEngineer.description'),
      tags: ['STM32', 'FreeRTOS', 'C'],
      icon: FiCpu,
    },
    {
      key: 'pcbDesignEngineer',
      title: t('careerExtended.jobs.pcbDesignEngineer.title'),
      department: t('careerExtended.departments.rnd'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '2-5 years',
      salary: '₹8-16 LPA',
      description: t('careerExtended.jobs.pcbDesignEngineer.description'),
      tags: ['Altium', 'KiCad', 'DFM'],
      icon: FiLayers,
    },
    {
      key: 'mechanicalDesignEngineer',
      title: t('careerExtended.jobs.mechanicalDesignEngineer.title'),
      department: t('careerExtended.departments.mechanical'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '3-6 years',
      salary: '₹9-17 LPA',
      description: t('careerExtended.jobs.mechanicalDesignEngineer.description'),
      tags: ['SolidWorks', 'GD&T', 'FEA'],
      icon: FiSettings,
    },
    {
      key: 'productionEngineer',
      title: t('careerExtended.jobs.productionEngineer.title'),
      department: t('careerExtended.departments.manufacturing'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹7-14 LPA',
      description: t('careerExtended.jobs.productionEngineer.description'),
      tags: ['Lean', '5S', 'SMT'],
      icon: FiTool,
    },
    {
      key: 'qualityEngineer',
      title: t('careerExtended.jobs.qualityEngineer.title'),
      department: t('careerExtended.departments.quality'),
      location: t('careerExtended.locations.mohali'),
      type: 'Full-time',
      experience: '2-5 years',
      salary: '₹6-13 LPA',
      description: t('careerExtended.jobs.qualityEngineer.description'),
      tags: ['ISO 13485', 'Audits', 'CAPA'],
      icon: FiCheckSquare,
    },
  ];

  const benefits = [
    { icon: FiZap, title: t('careerExtended.benefits.realWorldImpact.title'), desc: t('careerExtended.benefits.realWorldImpact.desc') },
    { icon: FiUsers, title: t('careerExtended.benefits.collaborativeTeams.title'), desc: t('careerExtended.benefits.collaborativeTeams.desc') },
    { icon: FiTrendingUp, title: t('careerExtended.benefits.innovationDriven.title'), desc: t('careerExtended.benefits.innovationDriven.desc') },
    { icon: FiUser, title: t('careerExtended.benefits.ownership.title'), desc: t('careerExtended.benefits.ownership.desc') },
    { icon: FiBookOpen, title: t('careerExtended.benefits.learnAndGrow.title'), desc: t('careerExtended.benefits.learnAndGrow.desc') },
    { icon: FiAward, title: t('careerExtended.benefits.careerGrowth.title'), desc: t('careerExtended.benefits.careerGrowth.desc') },
  ];

  const teams = [
    { name: t('careerExtended.teams.rnd'), icon: FiCpu, image: '/Design & Engineering.jpg' },
    { name: t('careerExtended.teams.software'), icon: FiCode, image: '/IoT Software Development.jpg' },
    { name: t('careerExtended.teams.electronics'), icon: FiMonitor, image: '/IT Electronics.jpg' },
    { name: t('careerExtended.teams.embedded'), icon: FiCpu, image: '/Embedded Electronics & IoT.jpg' },
    { name: t('careerExtended.teams.mechanical'), icon: FiSettings, image: '/Manufacturing Engineering & Mold Design.jpg' },
    { name: t('careerExtended.teams.manufacturing'), icon: FiTool, image: '/contract manufacturing.jpg' },
    { name: t('careerExtended.teams.quality'), icon: FiCheckSquare, image: '/Quality Assurance.jpg' },
    { name: t('careerExtended.teams.business'), icon: FiBriefcase, image: '/IP Oriented Product.jpg' },
  ];

  const hiringSteps = [
    { step: '01', title: t('careerExtended.hiringSteps.apply.title'), desc: t('careerExtended.hiringSteps.apply.desc') },
    { step: '02', title: t('careerExtended.hiringSteps.screening.title'), desc: t('careerExtended.hiringSteps.screening.desc') },
    { step: '03', title: t('careerExtended.hiringSteps.technicalRound.title'), desc: t('careerExtended.hiringSteps.technicalRound.desc') },
    { step: '04', title: t('careerExtended.hiringSteps.interview.title'), desc: t('careerExtended.hiringSteps.interview.desc') },
    { step: '05', title: t('careerExtended.hiringSteps.welcome.title'), desc: t('careerExtended.hiringSteps.welcome.desc') },
  ];

  const statsData = [
    { icon: FiBriefcase, stat: '2016', label: t('careerExtended.stats.yearFounded') },
    { icon: FiGlobe, stat: '150,000+', label: t('careerExtended.stats.manufacturingFacility') },
    { icon: FiTrendingUp, stat: '300K+', label: t('careerExtended.stats.devicesCapacity') },
    { icon: FiUsers, stat: '400+', label: t('careerExtended.stats.teamMembers') },
  ];

  const cultureImages = [
    { src: '/walklab 3.0.jpeg', alt: 'Innovation lab' },
    { src: '/home background.jpg', alt: 'Team collaboration' },
    { src: '/Continuous Improvement.jpg', alt: 'Continuous Improvement' },
    { src: '/Research & Market Analysis.jpg', alt: 'Research & Market Analysis' },
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDept = activeDept === t('careerExtended.departments.all') || job.department === activeDept;
    const matchesLocation = activeLocation === t('careerExtended.locations.all') || job.location === activeLocation;
    const matchesExperience = activeExperience === t('careerExtended.experiences.all') || job.experience === activeExperience;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesLocation && matchesExperience && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div ref={ref}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4"
              >
                {t('career.title')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
              >
                {t('career.subtitle')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-slate-500 text-lg mb-8 max-w-lg leading-relaxed"
              >
                {t('career.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <a href="#openings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300">
                  {t('careerExtended.explorePositions')}
                  <FiArrowRight className="w-4 h-4" />
                </a>
                <a href="#culture" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-300">
                  {t('careerExtended.lifeAtWalnut')}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-4 text-sm text-slate-500"
              >
                <span>{t('careerExtended.engineering')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{t('careerExtended.innovation')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{t('careerExtended.impact')}</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/career background.jpg"
                  alt="Walnut Medical Team"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Floating video card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-blue-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t('careerExtended.watchOur')}</p>
                  <p className="font-semibold text-slate-900 text-sm">{t('careerExtended.ourStory')}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsData.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="text-center"
                >
                  <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-slate-900 mb-1">{item.stat}</div>
                  <div className="text-sm text-slate-500">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Walnut */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">{t('careerExtended.whyWalnut')}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {t('careerExtended.moreThanJob')}{' '}
                  <span className="text-slate-900">{t('careerExtended.buildSomethingReal')}</span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed">
                {t('careerExtended.whyWalnutDesc')}
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.08}>
                <div className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">{t('careerExtended.findNextChallenge')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              {t('careerExtended.exploreOpportunities')}
            </h2>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-4 mb-8">
              <select
                value={activeDept}
                onChange={(e) => setActiveDept(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={activeLocation}
                onChange={(e) => setActiveLocation(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              
              <select
                value={activeExperience}
                onChange={(e) => setActiveExperience(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              
              <div className="relative flex-1 min-w-[200px]">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('careerExtended.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Job Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, i) => (
                <motion.div
                  key={job.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={`/apply?title=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}&exp=${encodeURIComponent(job.experience)}&salary=${encodeURIComponent(job.salary)}`}
                    className="group block bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <job.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('careerExtended.applyNow')} <FiArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3">
                      <span>{job.department}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{job.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{job.type}</span>
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">{t('careerExtended.noJobsMatch')}</p>
            </div>
          )}

          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <Link to="/career#openings" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                {t('careerExtended.viewAllOpenings')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Teams You Can Join */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">{t('careerExtended.teamsYouCanJoin')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              {t('careerExtended.findYourPlace')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {teams.map((team, i) => (
              <AnimatedSection key={team.name} delay={i * 0.05}>
                <div className="group text-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{team.name}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Walnut */}
      <section id="culture" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">{t('careerExtended.lifeAtWalnutTitle')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {t('careerExtended.greatPeople')}{' '}
                <span className="text-blue-600">{t('careerExtended.greatCulture')}</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                {t('careerExtended.cultureDesc')}
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-white transition-colors">
                {t('careerExtended.exploreOurCulture')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {cultureImages.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-square">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">{t('careerExtended.hiringProcess')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              {t('careerExtended.simpleSteps')}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {hiringSteps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1}>
                <div className="relative">
                  {i < hiringSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2" />
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {t('careerExtended.cta.nextBigIdea')}{' '}
                    <span className="text-blue-400">{t('careerExtended.cta.couldStartHere')}</span>
                  </h2>
                </div>
                
                <div className="md:text-right">
                  <p className="text-white/70 mb-6">
                    {t('careerExtended.cta.ctaDesc')}
                  </p>
                  <div className="flex flex-wrap gap-4 md:justify-end">
                    <a href="#openings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                      {t('careerExtended.cta.exploreOpenRoles')}
                    </a>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
                      {t('careerExtended.cta.sendYourResume')}
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
