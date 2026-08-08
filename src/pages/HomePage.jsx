import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiHeart, FiCreditCard, FiCpu, FiCheckCircle, FiShield, FiGlobe, FiArrowUpRight,
  FiZap, FiSearch, FiEdit3, FiLayers, FiSettings, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiActivity
} from 'react-icons/fi';
import Hero from '../components/Hero';

const whyChooseUs = [
  { icon: FiShield, title: 'ISO 13485 Certified', desc: 'Quality management for medical devices' },
  { icon: FiGlobe, title: '20+ Countries', desc: 'Global supply chain and logistics' },
  { icon: FiCheckCircle, title: '99.8% Yield Rate', desc: 'Industry-leading manufacturing precision' },
];

const processCards = [
  { step: 1, title: 'IDEA', description: 'Concept ideation and requirement gathering from market needs.', image: '/Idea & Requirement.jpg' },
  { step: 2, title: 'RESEARCH', description: 'In-depth market and technology research to validate the idea.', image: '/Research & Market Analysis.jpg' },
  { step: 3, title: 'DESIGN', description: 'Product design and engineering with CAD modeling.', image: '/Design & Engineering.jpg' },
  { step: 4, title: 'PROTOTYPE', description: 'Rapid prototyping and iterative development cycles.', image: '/Prototype Development.jpg' },
  { step: 5, title: 'TESTING', description: 'Rigorous testing and validation for reliability.', image: '/Validation & Testing.jpg' },
  { step: 6, title: 'MOLDING', description: 'Manufacturing engineering and mold design.', image: '/Manufacturing Engineering & Mold Design.jpg' },
  { step: 7, title: 'QA', description: 'Comprehensive quality assurance and compliance.', image: '/Quality Assurance.jpg' },
  { step: 8, title: 'PACKAGING', description: 'Professional packaging and global dispatch.', image: '/Packaging & Dispatch.jpg' },
  { step: 9, title: 'SUPPORT', description: 'Dedicated after-sales support and service.', image: '/After Sales Support.jpg' },
  { step: 10, title: 'IMPROVEMENT', description: 'Continuous improvement based on feedback.', image: '/Continuous Improvement.jpg' },
];

const companyJourney = [
  { year: '2016', title: 'FOUNDED', description: 'Walnut Medical Pvt. Ltd. established in Mohali, Punjab with a vision to make India self-reliant in medical device manufacturing.', icon: FiZap },
  { year: '2017', title: 'R&D PHASE', description: 'Built core engineering team. Started developing indigenous medical devices including BP monitors and thermometers.', icon: FiSearch },
  { year: '2018', title: 'FIRST PRODUCTS', description: 'Launched Blood Pressure Monitor and Infrared Thermometer. Established PCB design and firmware development capabilities.', icon: FiEdit3 },
  { year: '2019', title: 'FACILITY EXPANSION', description: 'Expanded to 150,000 sqft manufacturing facility. Installed 4 SMT lines with 300K+ units/month capacity.', icon: FiLayers },
  { year: '2020', title: 'OXYGEN CONCENTRATOR', description: 'First Indian manufacturer of Oxygen Concentrators. Supported by CAWACH fund from Dept. of Science & Technology with IIT Delhi.', icon: FiCheckCircle },
  { year: '2021', title: 'NEURO REHAB DEVICES', description: 'Launched WalkLab Robotic Gait Training, Walkex FES, rTMS MedStim, TDCS Mind Acquity, and CES Repose.', icon: FiSettings },
  { year: '2022', title: 'PAYMENT SYSTEMS', description: 'Entered Payment Systems with POS terminals and QR Soundboxes. Featured in Pharmabiz, Indian Express, DD News.', icon: FiShield },
  { year: '2023', title: 'GLOBAL REACH', description: 'Expanded to 20+ countries. Achieved ISO 13485, CE, FCC, PCI-DSS certifications. 10 million units milestone.', icon: FiTruck },
  { year: '2024', title: 'INDUSTRY 4.0', description: 'Adopted Industry 4.0 standards. 4 SMT lines, Class 10K cleanroom, full traceability and smart manufacturing.', icon: FiHeadphones },
  { year: '2025', title: 'INDUSTRY 5.0', description: 'Pioneering Industry 5.0 ecosystem with AI, Digital Twin, IoT, and human-centric manufacturing across 40+ countries.', icon: FiTrendingUp },
];

function JourneySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

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
                <span className="text-slate-900">FROM IDEA TO</span>
                <br />
                <span className="text-slate-900">LARGE SCALE.</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-lg">
                End-to-end product development and manufacturing powered by an Industry 5.0 ecosystem.
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
                  OUR JOURNEY
                </h2>
                <p className="text-sm text-slate-500">From a small workshop to a global manufacturing leader.</p>
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
                  PROCESS
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
                        STEP {item.step}
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

  const divisionsData = [
    {
      id: 'medical',
      title: 'Medical Devices',
      color: '#1e40af',
      icon: FiHeart,
      image: '/RTMS.png',
      features: ['ISO 13485 Certified', 'Class 10K Cleanroom', 'IEC 60601 Compliant'],
      link: '/solutions?category=Medical',
    },
    {
      id: 'fintech',
      title: 'Payment Systems',
      color: '#7c3aed',
      icon: FiCreditCard,
      image: '/Pocket Soundbox.png',
      features: ['PCI-DSS Certified', 'NPCI & RBI Compliant', 'EMV L1/L2'],
      link: '/solutions?category=Fintech',
    },
    {
      id: 'iot',
      title: 'IoT Solutions',
      color: '#0891b2',
      icon: FiWifi,
      image: '/IOT solutions.PNG',
      features: ['End-to-End Connectivity', 'Edge Computing', 'Cloud Integration'],
      link: '/solutions?product=iot-smart-lock',
    },
    {
      id: 'robotics',
      title: 'Neuro Rehab Devices',
      color: '#7c3aed',
      icon: FiActivity,
      image: '/walklab 3.0.jpeg',
      features: ['FDA Approved', 'IEC 60601 Compliant', 'Advanced Rehab Tech'],
      link: '/solutions?category=Robotics',
    },
    {
      id: 'automotive',
      title: 'Automotive Electronics',
      color: '#059669',
      icon: FiCpu,
      image: '/cluster.png',
      features: ['IATF 16949 Compliant', 'High Reliability', 'AEC-Q100 Qualified'],
      link: '/solutions?category=Automotive',
    },
    {
      id: 'custom',
      title: 'Custom Solutions',
      color: '#d97706',
      icon: FiSettings,
      image: '/custom solutions.jpg',
      features: ['4 SMT Lines', '300K+ Units/Month', 'Full Original Design Manufacturing'],
      link: '/solutions?category=Fintech',
    },
  ];

  const topDivisions = divisionsData.filter((_, i) => i % 2 === 0);
  const bottomDivisions = divisionsData.filter((_, i) => i % 2 === 1);

  return (
    <section id="divisions-preview" className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-4 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Our Solutions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
            Technology That Powers{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Every Connection
            </span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            High-performance engineering solutions across industries, built for reliability, compliance, and scale.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {divisionsData.map((div, index) => (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link to={div.link} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Content - Left Side */}
                <div className="flex-1 min-w-0">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${div.color}10`, border: `1px solid ${div.color}20` }}>
                    <div.icon className="w-5 h-5" style={{ color: div.color }} />
                  </div>
                  
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{div.title}</h3>
                  <ul className="space-y-1.5 mb-3">
                    {div.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <FiCheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Arrow Button */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                    <FiArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>

                {/* Image - Right Side */}
                <div className="w-32 h-32 flex items-center justify-center shrink-0">
                  <img 
                    src={div.image} 
                    alt={div.title} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {divisionsData.map((div, index) => (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
            >
              <Link to={div.link} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${div.color}10`, border: `1px solid ${div.color}20` }}>
                  <div.icon className="w-6 h-6" style={{ color: div.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 mb-1">{div.title}</h3>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {div.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="flex items-center gap-1 text-xs text-slate-500">
                        <FiCheckCircle className="w-2.5 h-2.5 text-blue-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
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

  const stats = [
    { value: '10+', label: 'Years of Excellence' },
    { value: '500+', label: 'Engineers & Technicians' },
    { value: '20+', label: 'Countries Served' },
    { value: '300K+', label: 'Units Manufactured/Month' },
    { value: '150,000 sq.ft', label: 'Facility Size' },
    { value: '4', label: 'SMT Production Lines' },
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

  const certifications = [
    { title: 'ISO 13485', description: 'Quality management for medical devices' },
    { title: 'Class 10K Cleanroom', description: 'Controlled manufacturing environment' },
    { title: 'CE, FCC, PCI-DSS', description: 'European, US & payment security standards' },
    { title: 'IEC 60601', description: 'Medical electrical equipment safety' },
    { title: 'BIS Certified', description: 'Bureau of Indian Standards compliance' },
  ];

  const clients = [
    'Healthcare Leaders',
    'Banking & Finance',
    'Tech Innovators',
    'Industrial Giants',
    'Government Bodies',
    'Global Enterprises',
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
            Trust & Compliance
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Clients &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 font-black">
              Certifications
            </span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Trusted by industry leaders worldwide with international quality standards.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Certifications</h3>
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
            <h3 className="text-lg font-bold font-display text-slate-900 mb-4">Our Clients</h3>
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
                      <p className="text-xs text-slate-500">Trusted Partner</p>
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
                    Ready to Build Your Next Product?
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-6">
                    From concept to certification — we handle the entire manufacturing journey. ISO 13485 certified, 4 SMT lines, 300K+ units/month capacity.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300"
                    >
                      Get in Touch
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href="/solutions"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      View Solutions
                    </a>
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
