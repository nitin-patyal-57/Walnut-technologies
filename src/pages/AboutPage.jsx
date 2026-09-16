import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { brand, about } from '../data/content';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import {
  FiArrowRight, FiTarget, FiEye, FiZap, FiShield, FiGlobe,
  FiHeart, FiAward, FiCpu, FiUsers, FiCheckCircle, FiArrowUpRight,
  FiTool, FiTrendingUp, FiPackage, FiSettings, FiStar, FiArrowDown
} from 'react-icons/fi';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="About Us"
        description="Learn about Walnut Technologies - ISO 13485 certified OEM/ODM manufacturer with 15+ years experience, 500K+ units/month capacity, serving medical devices, payment systems, and custom electronics worldwide."
        path="/about"
        keywords="about walnut technologies, OEM manufacturer India, electronics manufacturing company, ISO 13485 certified"
      />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/aboutbackground.webp"
            alt="Walnut Technologies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0 w-full">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              About Walnut Technologies
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-slate-900 leading-[1.05] mb-4"
            >
              Engineering
              <br />
              <span className="text-blue-600">Ideas.</span>
              <br />
              Building the
              <br />
              <span className="text-blue-600">Future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm"
            >
              We transform ideas into reliable electronic products through engineering, innovation and manufacturing excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Discover Walnut
                <FiArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all backdrop-blur-sm"
              >
                Our Solutions
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR — overlapping hero */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { value: '10+', label: 'Years of Excellence' },
              { value: '400+', label: 'Engineers & Technicians' },
              { value: '20+', label: 'Countries Served' },
              { value: '500K+', label: 'Units Manufactured/Month' },
              { value: '150,000 sq.ft', label: 'Facility Size' },
              { value: '4', label: 'SMT Production Lines' },
            ].map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.05}>
                <div className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 px-4 py-5 text-center hover:shadow-2xl transition-shadow">
                  <div className="text-xl lg:text-2xl font-black text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHO WE ARE — Magazine style with overlapping images
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left - Images stack */}
            <AnimatedSection className="lg:col-span-5">
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/Walnut_About_Page_Images_Single/08_Electronics_Manufacturing_Factory.webp"
                    alt="Manufacturing Facility"
                    className="w-full h-[320px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-6 lg:-right-10 z-20 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="/Walnut_About_Page_Images_Single/04_Engineering_Team.webp"
                    alt="Engineering Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative dot */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-full -z-10" />
              </div>
            </AnimatedSection>

            {/* Right - Content */}
            <AnimatedSection delay={0.2} className="lg:col-span-7 lg:pl-8">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 mb-6 leading-tight">
                More Than Electronics.
                <br />
                <span className="text-blue-600">We Build Possibilities.</span>
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed mb-6">
                <p>
                  Walnut Technologies was built with a vision to create meaningful technology through engineering and innovation. From medical devices to payment systems, we have grown into connected electronics, payment systems and advanced manufacturing. Our journey has been driven by one principle — solving real-world problems through technology.
                </p>
                <p>
                  Today, we bring together engineering, product development and manufacturing capabilities to help transform ideas into dependable electronic solutions.
                </p>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '150K+', label: 'Sq. Ft. Facility' },
                  { value: '500K+', label: 'Units / Month' },
                  { value: '20+', label: 'Countries Served' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-xl font-black text-blue-600">{stat.value}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EVOLUTION — Horizontal scroll-style timeline
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                  Our Evolution
                </span>
                <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 leading-tight">
                  From Healthcare Innovation
                  <br />
                  <span className="text-blue-600">to Electronics Technology</span>
                </h2>
              </div>
              <Link
                to="/career"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shrink-0"
              >
                Explore Our Journey
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Timeline cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Foundation', desc: 'Walnut Medical & Healthcare Technology', image: '/Walnut_About_Page_Images_Single/02_Electronics_Engineer_Lab.webp', color: 'from-blue-600 to-blue-700', slug: 'foundation' },
              { num: '02', title: 'Innovation', desc: 'Neurorehabilitation & Medical Electronics', image: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp', color: 'from-cyan-500 to-cyan-600', slug: 'innovation' },
              { num: '03', title: 'Expansion', desc: 'Finance, IoT & Electronics', image: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp', color: 'from-blue-500 to-indigo-600', slug: 'expansion' },
              { num: '04', title: 'Today', desc: 'Engineering & Manufacturing Excellence', image: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp', color: 'from-indigo-500 to-violet-600', slug: 'today' },
            ].map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.1}>
                <Link
                  to={`/about/evolution/${step.slug}`}
                  className="group block relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Number badge */}
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-sm font-black text-white">{step.num}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Bottom accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${step.color}`} />
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRINCIPLES — 4 cards with icons
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                What Drives Us
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900">
                Built Around Four Principles
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiZap, title: 'Innovation', desc: 'We continuously explore new technologies and better ways to solve problems.', color: 'from-blue-500 to-blue-600' },
              { icon: FiShield, title: 'Reliability', desc: 'We design products with performance, quality and long-term use in mind.', color: 'from-cyan-500 to-cyan-600' },
              { icon: FiHeart, title: 'Responsibility', desc: 'We take ownership throughout the product lifecycle.', color: 'from-indigo-500 to-indigo-600' },
              { icon: FiUsers, title: 'Partnership', desc: 'We work closely with customers to turn requirements into real-world solutions.', color: 'from-violet-500 to-violet-600' },
            ].map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1}>
                <div className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-500 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <p.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ENGINEERING — Dark section with PCB background
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/Walnut_About_Page_Images_Single/10_PCB_Closeup.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl mb-14">
              <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                Engineering With Purpose
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-white leading-tight">
                Technology should not simply work.
                <br />
                <span className="text-cyan-400">It should solve something meaningful.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: FiTarget, title: 'Understand The Problem', desc: 'We start with real-world requirements.' },
              { num: '02', icon: FiTool, title: 'Engineer The Solution', desc: 'We combine technology, design and engineering expertise.' },
              { num: '03', icon: FiStar, title: 'Create Long-Term Value', desc: 'We build solutions designed for reliability and scalability.' },
            ].map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.15}>
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-black text-white/10">{step.num}</span>
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{step.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OUR PEOPLE — Team section with badges
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Content */}
            <AnimatedSection className="lg:col-span-5 order-2 lg:order-1">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Our People
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 mb-4 leading-tight">
                People Behind the Technology
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Great products begin with great people. Our team brings together engineers, designers, developers, manufacturing specialists and problem-solvers who share a passion for building meaningful technology.
              </p>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: FiSettings, label: 'Engineering', count: '400+' },
                  { icon: FiZap, label: 'Innovation', count: '50+' },
                  { icon: FiShield, label: 'Quality', count: '100%' },
                  { icon: FiPackage, label: 'Manufacturing', count: '500K+' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.count}</div>
                      <div className="text-[11px] text-slate-500">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/career"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                Life at Walnut
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            {/* Image grid */}
            <AnimatedSection delay={0.2} className="lg:col-span-7 order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                    <img
                      src="/Walnut_About_Page_Images_Single/04_Engineering_Team.webp"
                      alt="Engineering Team"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                    <img
                      src="/Walnut_About_Page_Images_Single/09_Team_Collaboration.webp"
                      alt="Team Collaboration"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                    <img
                      src="/Walnut_About_Page_Images_Single/11_Modern_Conference_Room.webp"
                      alt="Conference Room"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                    <img
                      src="/Walnut_About_Page_Images_Single/12_Business_Partnership.webp"
                      alt="Business Partnership"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          QUALITY COMMITMENT — With process steps
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <AnimatedSection>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/Walnut_About_Page_Images_Single/07_PCB_Testing.webp"
                    alt="Quality Testing"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-900">ISO 13485</div>
                      <div className="text-xs text-slate-500">Certified Quality</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection delay={0.2}>
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Our Commitment
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 mb-4 leading-tight">
                Quality Is Not a Department.
                <br />
                <span className="text-blue-600">It's a Mindset.</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Quality is built into every stage of our product lifecycle.
              </p>

              {/* Process steps */}
              <div className="space-y-3">
                {['Design', 'Engineering', 'Validation', 'Testing', 'Manufacturing', 'Quality Control'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{step}</span>
                    {i < 5 && <div className="flex-1 h-px bg-slate-200" />}
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-emerald-600">Reliable Product</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FUTURE — 3 image cards
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                Where We're Going
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900">
                Building the Future of Electronics
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FiGlobe, title: 'Global', desc: 'Expanding our technology and manufacturing reach across 40+ countries.', image: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp', slug: 'global' },
              { icon: FiCpu, title: 'Intelligent', desc: 'Building smarter connected products with AI and IoT integration.', image: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp', slug: 'intelligent' },
              { icon: FiTrendingUp, title: 'Scalable', desc: 'Creating solutions ready for real-world deployment at any scale.', image: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp', slug: 'scalable' },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <Link
                  to={`/about/future/${item.slug}`}
                  className="group block relative rounded-2xl overflow-hidden h-80 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">{item.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MISSION & VISION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 lg:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left — Mission & Vision */}
            <div>
              <AnimatedSection>
                <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                  Our Purpose
                </span>
                <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 mb-6 leading-tight">
                  Purpose-Driven
                  <br />
                  <span className="text-blue-600">Technology</span>
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="relative p-6 bg-white rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 overflow-hidden mb-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                      <FiTarget className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider mb-2">Our Mission</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{about.mission}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="relative p-6 bg-white rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                      <FiEye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-emerald-600 uppercase tracking-wider mb-2">Our Vision</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{about.vision}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right — Image */}
            <AnimatedSection delay={0.15}>
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                <img
                  src="/Walnut_About_Page_Images_Single/13_Purpose_Products.webp"
                  alt="Walnut Technologies Products - Medical Devices, Payment Systems, Electronics"
                  className="w-full h-auto object-contain"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/Walnut_About_Page_Images_Single/08_Electronics_Manufacturing_Factory.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/95" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-black font-display text-white mb-4">
              Let's Build What's Next.
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Have an idea, product or technology challenge? Let's turn possibilities into products.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
              >
                Talk to Walnut
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                View Solutions
                <FiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
