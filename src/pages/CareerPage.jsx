import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
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
    { name: t('careerExtended.teams.rnd'), icon: FiCpu, image: '/Design & Engineering.webp' },
    { name: t('careerExtended.teams.software'), icon: FiCode, image: '/IoT Software Development.webp' },
    { name: t('careerExtended.teams.electronics'), icon: FiMonitor, image: '/IT Electronics.webp' },
    { name: t('careerExtended.teams.embedded'), icon: FiCpu, image: '/Embedded Electronics & IoT.webp' },
    { name: t('careerExtended.teams.mechanical'), icon: FiSettings, image: '/Manufacturing Engineering & Mold Design.webp' },
    { name: t('careerExtended.teams.manufacturing'), icon: FiTool, image: '/contract manufacturing.webp' },
    { name: t('careerExtended.teams.quality'), icon: FiCheckSquare, image: '/Quality Assurance.webp' },
    { name: t('careerExtended.teams.business'), icon: FiBriefcase, image: '/IP Oriented Product.webp' },
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
    { icon: FiTrendingUp, stat: '500K+', label: t('careerExtended.stats.devicesCapacity') },
    { icon: FiUsers, stat: '400+', label: t('careerExtended.stats.teamMembers') },
  ];

  const cultureImages = [
    { src: '/life at walnut.webp', alt: 'Life at Walnut' },
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
      <SEO
        title="Career"
        description="Join Walnut Technologies - Explore exciting career opportunities in medical electronics, embedded systems, IoT, and software development. Grow with us in Mohali, Punjab."
        path="/career"
        keywords="Walnut Technologies careers, electronics jobs, medical device careers, embedded systems jobs, IoT careers India"
      />
      
      {/* JobPosting Structured Data */}
      <Helmet>
        {jobOpenings.map((job) => (
          <script key={job.key} type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": job.title,
              "description": job.description,
              "datePosted": new Date().toISOString().split('T')[0],
              "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "employmentType": job.type.toUpperCase().replace('-', '_'),
              "hiringOrganization": {
                "@type": "Organization",
                "name": "Walnut Technologies Pvt. Ltd.",
                "sameAs": "https://walnutmedical.in",
                "logo": "https://walnutmedical.in/walnut-logo/Walnut_Technologies_logo_transparent.png"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Plot No. 132, JLPL Industrial Park, Sector 82",
                  "addressLocality": "Mohali",
                  "addressRegion": "Punjab",
                  "postalCode": "160055",
                  "addressCountry": "IN"
                }
              },
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "INR",
                "value": {
                  "@type": "QuantitativeValue",
                  "minValue": parseInt(job.salary.match(/[\d]+/g)?.[0] || "5") * 100000,
                  "maxValue": parseInt(job.salary.match(/[\d]+/g)?.[1] || "15") * 100000,
                  "unitText": "YEAR"
                }
              }
            })}
          </script>
        ))}
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div ref={ref}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3"
              >
                {t('career.title')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-4 leading-tight"
              >
                {t('career.subtitle')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-sm text-slate-500 mb-6 max-w-lg leading-relaxed"
              >
                {t('career.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                <a href="#openings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors duration-300">
                  {t('careerExtended.explorePositions')}
                  <FiArrowRight className="w-4 h-4" />
                </a>
                <a href="#culture" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-colors duration-300">
                  {t('careerExtended.lifeAtWalnut')}
                </a>
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
                  src="/career background.webp"
                  alt="Walnut Medical Team"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Walnut + Benefits */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">{t('careerExtended.whyWalnut')}</p>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-2">
                {t('careerExtended.moreThanJob')}{' '}
                <span className="text-blue-600">{t('careerExtended.buildSomethingReal')}</span>
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto">{t('careerExtended.whyWalnutDesc')}</p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.06}>
                <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                    <benefit.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold font-display text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{benefit.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Life at Walnut - Full width image */}
      <section id="culture" className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <AnimatedSection className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-slate-900 mb-4">
                {t('careerExtended.lifeAtWalnutTitle')}
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {t('careerExtended.cultureDesc')}
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
                {t('careerExtended.exploreOurCulture')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={cultureImages[0].src}
                  alt={cultureImages[0].alt}
                  className="w-full h-[250px] md:h-[350px] object-cover"
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Teams + Hiring Process */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Teams */}
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">{t('careerExtended.teamsYouCanJoin')}</p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-6">
              {t('careerExtended.findYourPlace')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
            {teams.map((team, i) => (
              <AnimatedSection key={team.name} delay={i * 0.04}>
                <div className="group text-center">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 relative">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <p className="text-[10px] md:text-xs font-semibold text-slate-700">{team.name}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Hiring Process */}
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">{t('careerExtended.hiringProcess')}</p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-6">
              {t('careerExtended.simpleSteps')}
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {hiringSteps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.08}>
                <div className="relative">
                  {i < hiringSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2" />
                  )}
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold text-sm">{step.step}</span>
                    </div>
                    <h3 className="text-sm font-bold font-display text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3">{t('careerExtended.findNextChallenge')}</p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-6">
              {t('careerExtended.exploreOpportunities')}
            </h2>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={activeDept}
                onChange={(e) => setActiveDept(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={activeLocation}
                onChange={(e) => setActiveLocation(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              
              <select
                value={activeExperience}
                onChange={(e) => setActiveExperience(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {experiences.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
              
              <div className="relative flex-1 min-w-[180px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('careerExtended.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Job Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="group block bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <job.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-blue-600 font-semibold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('careerExtended.applyNow')} <FiArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold font-display text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <span>{job.department}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{job.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{job.type}</span>
                    </div>
                    
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {job.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-base">{t('careerExtended.noJobsMatch')}</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
