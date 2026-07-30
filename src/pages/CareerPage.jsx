import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiUsers, FiTrendingUp, FiGlobe, FiHeart, FiZap,
  FiArrowRight, FiCheckCircle, FiMapPin, FiClock, FiDollarSign,
  FiShield, FiStar, FiCoffee, FiBookOpen, FiAward, FiSmile, FiSearch, FiChevronRight
} from 'react-icons/fi';

const jobOpenings = [
  {
    title: 'SMT Process Engineer',
    department: 'Manufacturing',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹8-14 LPA',
    description: 'Optimize SMT lines for medical device production. Work with latest pick-and-place and reflow technology.',
    tags: ['SMT', 'Reflow', 'IPC Standards'],
    color: 'from-blue-500 to-cyan-500',
    accent: 'bg-blue-500',
  },
  {
    title: 'Quality Assurance Lead',
    department: 'Quality',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '5-8 years',
    salary: '₹12-20 LPA',
    description: 'Lead ISO 13485 compliance audits and drive continuous improvement across all production lines.',
    tags: ['ISO 13485', 'Audits', 'CAPA'],
    color: 'from-emerald-500 to-green-500',
    accent: 'bg-emerald-500',
  },
  {
    title: 'Embedded Systems Developer',
    department: 'R&D',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹7-15 LPA',
    description: 'Design firmware for next-gen medical and IoT devices. STM32, ESP32, Nordic ecosystems.',
    tags: ['STM32', 'ESP32', 'FreeRTOS'],
    color: 'from-purple-500 to-pink-500',
    accent: 'bg-purple-500',
  },
  {
    title: 'PCB Design Engineer',
    department: 'R&D',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '2-5 years',
    salary: '₹8-16 LPA',
    description: 'Create multi-layer PCB layouts for high-reliability applications. Altium/KiCad expertise.',
    tags: ['Altium', 'KiCad', 'DFM'],
    color: 'from-purple-500 to-pink-500',
    accent: 'bg-purple-500',
  },
  {
    title: 'Supply Chain Coordinator',
    department: 'Operations',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '2-3 years',
    salary: '₹5-9 LPA',
    description: 'Manage global vendor relationships and optimize inventory for 300K+ units/month production.',
    tags: ['Procurement', 'Inventory', 'Logistics'],
    color: 'from-orange-500 to-amber-500',
    accent: 'bg-orange-500',
  },
  {
    title: 'Production Line Supervisor',
    department: 'Manufacturing',
    location: 'Manesar, Haryana',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '₹6-12 LPA',
    description: 'Oversee daily SMT operations, manage teams of 15-20 operators, ensure quality targets are met.',
    tags: ['Team Lead', 'Lean', '5S'],
    color: 'from-blue-500 to-cyan-500',
    accent: 'bg-blue-500',
  },
];

const benefits = [
  { icon: FiShield, title: 'Health Coverage', desc: 'Comprehensive medical insurance for you and your family', color: 'from-blue-500 to-cyan-500' },
  { icon: FiTrendingUp, title: 'Growth Path', desc: 'Clear career progression with quarterly review cycles', color: 'from-emerald-500 to-green-500' },
  { icon: FiBookOpen, title: 'Learning Budget', desc: 'Annual ₹50K+ for certifications, courses, and conferences', color: 'from-purple-500 to-pink-500' },
  { icon: FiCoffee, title: 'Work-Life Balance', desc: 'Flexible shifts, paid leave, and team outings every quarter', color: 'from-orange-500 to-red-500' },
  { icon: FiDollarSign, title: 'Competitive Pay', desc: 'Industry-leading salaries with performance bonuses', color: 'from-yellow-500 to-amber-500' },
  { icon: FiAward, title: 'Recognition', desc: 'Monthly star performer awards and annual excellence prizes', color: 'from-rose-500 to-pink-500' },
];

const cultureHighlights = [
  { icon: FiUsers, stat: '200+', label: 'Team Members' },
  { icon: FiGlobe, stat: '20+', label: 'Countries Served' },
  { icon: FiStar, stat: '4.8', label: 'Glassdoor Rating' },
  { icon: FiSmile, stat: '92%', label: 'Employee Retention' },
];

const values = [
  { title: 'Innovate Fearlessly', desc: 'We encourage bold ideas and experimentation. Fail fast, learn faster.' },
  { title: 'Own Your Impact', desc: 'Every role matters. Your contributions directly shape products used globally.' },
  { title: 'Learn Continuously', desc: 'Stay curious. We invest in your growth because better people make better products.' },
  { title: 'Collaborate Authentically', desc: 'No silos, no politics. Just honest teamwork toward shared goals.' },
];

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
  const [activeDept, setActiveDept] = useState('All');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/career background.jpg"
            alt="Walnut Technologies Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
        </div>

        <div ref={ref} className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                We're Hiring
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl md:text-5xl font-bold font-display text-white mb-5 leading-tight"
            >
              Build What{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Matters
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-base text-white/70 mb-7 leading-relaxed"
            >
              Join a team that's shaping the future of electronics manufacturing. 
              From medical devices to smart IoT solutions — your work here impacts 
              millions of lives across 20+ countries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <a href="#openings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300">
                View Open Roles
                <FiArrowRight className="w-4 h-4" />
              </a>
              <a href="#culture" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors duration-300">
                Our Culture
              </a>
            </motion.div>
          </div>
        </div>

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cultureHighlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="bg-white rounded-lg p-4 text-center shadow-lg border border-slate-100"
                >
                  <item.icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold font-display text-slate-900 mb-0.5">{item.stat}</div>
                  <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Join Us + Culture */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-4">
                <FiHeart className="w-4 h-4" />
                Why Walnut
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3">
                More Than a{' '}
                <span className="text-blue-600">Job</span>
              </h2>
              <p className="text-slate-500 max-w-2xl">
                We're building something meaningful — and we want people who care about quality, innovation, and real impact.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Culture Values - Inline */}
          <AnimatedSection delay={0.2}>
            <div className="mt-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold mb-6">
                <FiZap className="w-4 h-4" />
                How We Work
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-0.5">{value.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold mb-4">
                <FiBriefcase className="w-4 h-4" />
                Open Positions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3">
                Find Your{' '}
                <span className="text-emerald-600">Role</span>
              </h2>
              <p className="text-slate-500 max-w-2xl">
                We're always looking for talented people who want to do their best work.
              </p>
            </div>
          </AnimatedSection>

          {/* Department Filter */}
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-8">
              {['All', 'Manufacturing', 'R&D', 'Quality', 'Operations'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeDept === dept
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                >
                  {dept}
                  {dept !== 'All' && (
                    <span className="ml-1.5 text-xs opacity-60">
                      ({jobOpenings.filter(j => dept === 'All' || j.department === dept).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Job Cards - Compact Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {jobOpenings
                .filter(job => activeDept === 'All' || job.department === activeDept)
                .map((job, i) => (
                <motion.div
                  key={job.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link to={`/apply?title=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}&exp=${encodeURIComponent(job.experience)}&salary=${encodeURIComponent(job.salary)}`} className="group block relative rounded-2xl bg-white border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                    {/* Top accent line */}
                    <div className={`h-1 w-full bg-gradient-to-r ${job.color}`} />

                    <div className="p-5">
                      {/* Department badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full bg-gradient-to-r ${job.color} text-white text-[10px] font-bold`}>
                          {job.department}
                        </span>
                        <FiArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                        {job.title}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Info */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" /> Manesar
                        </span>
                        <span className="flex items-center gap-1">
                          <FiTrendingUp className="w-3 h-3" /> {job.experience}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <FiDollarSign className="w-3 h-3 text-amber-500" /> {job.salary}
                        </span>
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom note */}
          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Don't see what you're looking for?{' '}
                <a href="/contact" className="text-blue-600 font-semibold hover:underline">
                  Send us your resume anyway →
                </a>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative p-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                  Don't See Your{' '}
                  <span className="text-blue-400">Role?</span>
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  We're always open to meeting talented people. Send us your resume — 
                  we'll reach out when the right opportunity opens up.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300">
                    Send Your Resume
                    <FiArrowRight className="w-4 h-4" />
                  </a>
                  <a href="/about" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-colors duration-300">
                    Learn About Us
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
