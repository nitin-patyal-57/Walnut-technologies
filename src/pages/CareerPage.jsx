import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiBriefcase, FiUsers, FiTrendingUp, FiGlobe, FiZap,
  FiArrowRight, FiBookOpen, FiAward, FiSearch,
  FiCpu, FiCode, FiLayers, FiSettings, FiMonitor,
  FiTool, FiCheckSquare, FiUser
} from 'react-icons/fi';

const jobOpenings = [
  {
    title: 'Software Engineer',
    department: 'Software',
    location: 'Mohali',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹8-16 LPA',
    description: 'Build scalable software solutions that connect products, users and intelligent devices.',
    tags: ['React', 'Node.js', 'Python'],
    icon: FiCode,
  },
  {
    title: 'Embedded Systems Engineer',
    department: 'R&D',
    location: 'Mohali',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹10-18 LPA',
    description: 'Develop firmware and embedded solutions for next-generation connected products.',
    tags: ['STM32', 'FreeRTOS', 'C'],
    icon: FiCpu,
  },
  {
    title: 'PCB Design Engineer',
    department: 'R&D',
    location: 'Mohali',
    type: 'Full-time',
    experience: '2-5 years',
    salary: '₹8-16 LPA',
    description: 'Design and develop high-performance PCBs from concept to production.',
    tags: ['Altium', 'KiCad', 'DFM'],
    icon: FiLayers,
  },
  {
    title: 'Mechanical Design Engineer',
    department: 'Mechanical',
    location: 'Mohali',
    type: 'Full-time',
    experience: '3-6 years',
    salary: '₹9-17 LPA',
    description: 'Design precision mechanical systems for medical, automotive and electronic products.',
    tags: ['SolidWorks', 'GD&T', 'FEA'],
    icon: FiSettings,
  },
  {
    title: 'Production Engineer',
    department: 'Manufacturing',
    location: 'Mohali',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹7-14 LPA',
    description: 'Drive efficient production, quality and continuous improvement across operations.',
    tags: ['Lean', '5S', 'SMT'],
    icon: FiTool,
  },
  {
    title: 'Quality Engineer',
    department: 'Quality',
    location: 'Mohali',
    type: 'Full-time',
    experience: '2-5 years',
    salary: '₹6-13 LPA',
    description: 'Ensure the highest standards of quality across developed and manufactured products.',
    tags: ['ISO 13485', 'Audits', 'CAPA'],
    icon: FiCheckSquare,
  },
];

const departments = ['All Departments', 'R&D', 'Software', 'Manufacturing', 'Quality', 'Mechanical'];
const locations = ['All Locations', 'Mohali'];
const experiences = ['All Experience', 'Fresher', '1-3 years', '3-5 years', '5+ years'];

const benefits = [
  { icon: FiZap, title: 'Real-World Impact', desc: 'Work on products that solve real problems and improve lives.' },
  { icon: FiUsers, title: 'Collaborative Teams', desc: 'Work with talented people across multiple disciplines.' },
  { icon: FiTrendingUp, title: 'Innovation Driven', desc: 'Encouraging new ideas, research and cutting-edge technologies.' },
  { icon: FiUser, title: 'Ownership', desc: 'Take responsibility, make decisions and see your impact.' },
  { icon: FiBookOpen, title: 'Learn & Grow', desc: 'Continuous learning opportunities to build your future.' },
  { icon: FiAward, title: 'Career Growth', desc: 'Clear growth paths and opportunities to advance.' },
];

const teams = [
  { name: 'R&D', icon: FiCpu, image: '/Design & Engineering.jpg' },
  { name: 'Software', icon: FiCode, image: '/IoT Software Development.jpg' },
  { name: 'Electronics', icon: FiMonitor, image: '/IT Electronics.jpg' },
  { name: 'Embedded', icon: FiCpu, image: '/Embedded Electronics & IoT.jpg' },
  { name: 'Mechanical', icon: FiSettings, image: '/Manufacturing Engineering & Mold Design.jpg' },
  { name: 'Manufacturing', icon: FiTool, image: '/contract manufacturing.jpg' },
  { name: 'Quality', icon: FiCheckSquare, image: '/Quality Assurance.jpg' },
  { name: 'Business', icon: FiBriefcase, image: '/IP Oriented Product.jpg' },
];

const hiringSteps = [
  { step: '01', title: 'Apply', desc: 'Submit your application and tell us what you can build.' },
  { step: '02', title: 'Screening', desc: 'Our team reviews your profile and gets in touch.' },
  { step: '03', title: 'Technical Round', desc: 'Show us how you think and solve real problems.' },
  { step: '04', title: 'Interview', desc: 'Meet the team and explore how we can grow together.' },
  { step: '05', title: 'Welcome', desc: 'Kickstart your journey and build the future with Walnut.' },
];

const cultureImages = [
  { src: '/walklab 3.0.jpeg', alt: 'Innovation lab' },
  { src: '/home background.jpg', alt: 'Team collaboration' },
  { src: '/Continuous Improvement.jpg', alt: 'Continuous Improvement' },
  { src: '/Research & Market Analysis.jpg', alt: 'Research & Market Analysis' },
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
  const [activeDept, setActiveDept] = useState('All Departments');
  const [activeLocation, setActiveLocation] = useState('All Locations');
  const [activeExperience, setActiveExperience] = useState('All Experience');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDept = activeDept === 'All Departments' || job.department === activeDept;
    const matchesLocation = activeLocation === 'All Locations' || job.location === activeLocation;
    const matchesExperience = activeExperience === 'All Experience' || job.experience === activeExperience;
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
                Careers at Walnut
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
              >
                Build Technology.{' '}
                <span className="text-blue-600">Shape the Future.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-slate-500 text-lg mb-8 max-w-lg leading-relaxed"
              >
                Join Walnut Medical and work on real-world products across medical technology, robotics, IoT, payment solutions and automotive electronics.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <a href="#openings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300">
                  Explore Open Positions
                  <FiArrowRight className="w-4 h-4" />
                </a>
                <a href="#culture" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg font-semibold transition-colors duration-300">
                  Life at Walnut
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex items-center gap-4 text-sm text-slate-500"
              >
                <span>Engineering</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Innovation</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Impact</span>
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
                  <p className="font-semibold text-slate-900 text-sm">Watch Our</p>
                  <p className="font-semibold text-slate-900 text-sm">Our Story</p>
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
              {[
                { icon: FiBriefcase, stat: '2016', label: 'Year Founded' },
                { icon: FiGlobe, stat: '150,000+', label: 'Sq. Ft. Manufacturing Facility' },
                { icon: FiTrendingUp, stat: '300K+', label: 'Devices / Month Capacity' },
                { icon: FiUsers, stat: '400+', label: 'Team Members' },
              ].map((item, i) => (
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
                <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">Why Walnut?</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  More Than a Job.{' '}
                  <span className="text-slate-900">Build Something Real.</span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed">
                At Walnut Medical, you don't just work on projects – you work on products that move from ideas and prototypes to real-world impact.
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
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">Find Your Next Challenge</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Explore Open Opportunities
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
                  placeholder="Search jobs..."
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
                        Apply Now <FiArrowRight className="w-4 h-4" />
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
              <p className="text-slate-500 text-lg">No jobs match your filters. Try adjusting your search criteria.</p>
            </div>
          )}

          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <Link to="/career" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                View All Openings
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
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">Teams You Can Join</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Find Your Place at Walnut
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
              <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">Life at Walnut</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Great People.{' '}
                <span className="text-blue-600">Great Culture.</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                We are a team of curious, passionate and driven individuals who love building innovative solutions.
              </p>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-white transition-colors">
                Explore Our Culture
                <FiArrowRight className="w-4 h-4" />
              </a>
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
            <p className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">Our Hiring Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              Simple Steps, Meaningful Connections
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
                    Your Next Big Idea{' '}
                    <span className="text-blue-400">Could Start Here.</span>
                  </h2>
                </div>
                
                <div className="md:text-right">
                  <p className="text-white/70 mb-6">
                    Be part of a team that builds technology that makes a difference.
                  </p>
                  <div className="flex flex-wrap gap-4 md:justify-end">
                    <a href="#openings" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                      Explore Open Roles
                    </a>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold transition-colors">
                      Send Your Resume
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
