import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SEO from '../components/SEO';
import {
  FiArrowLeft, FiArrowRight, FiTarget, FiCpu, FiGlobe, FiAward,
  FiShield, FiZap, FiHeart, FiUsers, FiCheckCircle, FiTrendingUp,
  FiTool, FiPackage, FiSettings, FiStar
} from 'react-icons/fi';

const evolutionData = {
  foundation: {
    num: '01',
    title: 'Foundation',
    subtitle: 'Walnut Medical Pvt. Ltd. established in Mohali, Punjab',
    heroImage: '/Walnut_About_Page_Images_Single/02_Electronics_Engineer_Lab.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    year: '2016',
    bigStatement: 'Born from a Simple Idea — Build Technology That Saves Lives',
    intro: 'Walnut Medical Pvt. Ltd. was established in Mohali, Punjab with a vision to make India self-reliant in medical device manufacturing.',
    timeline: [
      { year: '2016', event: 'Company incorporated in Mohali, Punjab with a mission to build indigenous medical devices' },
      { year: '2017', event: 'Built core engineering team. Began developing BP monitors and infrared thermometers from scratch' },
      { year: '2018', event: 'Launched first products — Blood Pressure Monitor and IR Thermometer. Established PCB design and firmware capabilities' },
    ],
    highlights: [
      { icon: FiTarget, title: 'The Problem We Saw', text: 'Indian hospitals were dependent on expensive imported medical devices. Quality healthcare technology was out of reach for most of the population. We set out to change that.', stat: '' },
      { icon: FiZap, title: 'First Breakthrough', text: 'Within 18 months, our team delivered the first FDA-compliant prototype of a digital blood pressure monitor. It met international quality standards while being priced for the Indian market.', stat: '18mo' },
      { icon: FiShield, title: 'ISO 13485 Certified', text: 'Achieved ISO 13485:2016 certification for medical device quality management — a critical milestone that opened doors to domestic and international markets.', stat: 'ISO' },
      { icon: FiHeart, title: 'First Hospital Partners', text: 'Partnered with leading hospitals in Delhi NCR for clinical trials. Delivered our first 500 units of patient monitoring systems, proving our manufacturing capability.', stat: '500+' },
    ],
    splitContent: {
      title: 'Why Mohali, Punjab?',
      text: 'We chose Mohali for its growing tech ecosystem, proximity to IIT Delhi for research collaboration, and access to skilled engineering talent from Punjab and Chandigarh. Today, our 150,000 sqft facility in JLPL Industrial Park is one of the largest electronics manufacturing setups in North India.',
      image: '/Walnut_About_Page_Images_Single/02_Electronics_Engineer_Lab.webp',
    },
    nextSlug: 'innovation',
    nextTitle: 'Innovation',
    nextColor: 'from-blue-600 to-blue-700',
  },
  innovation: {
    num: '02',
    title: 'Innovation',
    subtitle: 'Neurorehabilitation & Medical Electronics',
    heroImage: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    year: '2021',
    bigStatement: 'When Technology Meets the Human Nervous System',
    intro: 'After establishing ourselves in basic medical devices, we ventured into neurorehabilitation — a field where technology meets the human nervous system.',
    timeline: [
      { year: '2020', event: 'Became the first Indian manufacturer of Oxygen Concentrators. Supported by CAWACH fund from Dept. of Science & Technology with IIT Delhi' },
      { year: '2021', event: 'Launched WalkLab Robotic Gait Training, Walkex FES, rTMS MedStim, TDCS Mind Acquity, and CES Repose' },
      { year: '2023', event: 'Featured in Pharmabiz, Indian Express, and DD News for neurorehab innovation' },
    ],
    highlights: [
      { icon: FiCpu, title: 'WalkLab — Our Flagship', text: 'WalkLab is an AI-powered gait training system that uses real-time feedback and adaptive algorithms to personalize rehabilitation therapy. It combines robotics, sensors, and machine learning to help patients walk again.', stat: 'AI' },
      { icon: FiTool, title: 'Full Product Range', text: 'WalkLab (Gait Training), Walkex (FES), MedStim (rTMS), Mind Acquity (TDCS), and Repose (CES) — five distinct neuromodulation technologies, all developed in-house.', stat: '5' },
      { icon: FiAward, title: 'CAWACH Grant', text: 'Received CAWACH fund support from the Department of Science & Technology along with IIT Delhi for developing indigenous Oxygen Concentrators during the pandemic.', stat: 'IIT' },
      { icon: FiTrendingUp, title: 'Clinical Impact', text: 'Our neurorehab devices have been deployed across 50+ hospitals. Clinical studies show 30% faster recovery compared to traditional physiotherapy methods.', stat: '30%' },
    ],
    splitContent: {
      title: 'Why Neurorehabilitation?',
      text: 'India has over 10 million stroke survivors and millions more with spinal cord injuries and neurological conditions. Traditional rehabilitation is expensive, inconsistent, and inaccessible for most. We saw an opportunity to build affordable, AI-powered devices that could democratize access to quality rehabilitation therapy.',
      image: '/Walnut_About_Page_Images_Single/03_Microchip_PCB.webp',
    },
    nextSlug: 'expansion',
    nextTitle: 'Expansion',
    nextColor: 'from-blue-600 to-blue-700',
  },
  expansion: {
    num: '03',
    title: 'Expansion',
    subtitle: 'Payment Systems, IoT & Global Reach',
    heroImage: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    year: '2022',
    bigStatement: 'From Medical Devices to Global Electronics',
    intro: 'With medical devices and neurorehab firmly established, we expanded into fintech, IoT, and international markets.',
    timeline: [
      { year: '2019', event: 'Expanded to 150,000 sqft manufacturing facility with 4 SMT lines and 500K+ units/month capacity' },
      { year: '2022', event: 'Entered payment systems with POS terminals and QR soundboxes' },
      { year: '2023', event: 'Expanded to 20+ countries. Achieved ISO 13485, CE, FCC, PCI-DSS certifications' },
    ],
    highlights: [
      { icon: FiShield, title: 'PCI-DSS & EMV Certified', text: 'Achieved PCI-DSS, PCI PTS 5.x, EMV L1/L2, NPCI, and RBI certifications for our payment terminals. These are among the strictest security standards in the global payments industry.', stat: 'PCI' },
      { icon: FiGlobe, title: '20+ Countries', text: 'Our products operate across 20+ countries spanning India, Southeast Asia, Middle East, Africa, and Europe. Every product ships with full international certifications.', stat: '20+' },
      { icon: FiPackage, title: '150,000 sqft Facility', text: 'Scaled from 2,000 sqft to a state-of-the-art 150,000 sqft manufacturing facility. Features 4 high-speed SMT lines, Class 10K cleanroom, and automated testing.', stat: '150K' },
      { icon: FiZap, title: 'HDFC Bank Partnership', text: 'Deployed 10,000+ POS terminals for HDFC Bank across India. Our payment devices process INR 100Cr+ daily transactions with 99.8% first-pass yield.', stat: '10K+' },
    ],
    splitContent: {
      title: 'Why Fintech?',
      text: 'India\'s digital payment explosion — UPI processing billions of transactions monthly — created massive demand for secure, reliable payment hardware. We leveraged our manufacturing expertise to build POS terminals and soundboxes that meet NPCI, RBI, and PCI-DSS certifications. Today, our devices process INR 100Cr+ in daily transactions.',
      image: '/Walnut_About_Page_Images_Single/05_Global_Technology.webp',
    },
    nextSlug: 'today',
    nextTitle: 'Today',
    nextColor: 'from-blue-600 to-blue-700',
  },
  today: {
    num: '04',
    title: 'Today',
    subtitle: 'Engineering & Manufacturing Excellence',
    heroImage: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp',
    color: 'from-blue-600 to-blue-700',
    colorSolid: '#2563eb',
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-600',
    year: '2026',
    bigStatement: '400+ Engineers. 10M+ Units. Zero Compromises.',
    intro: 'Today, Walnut Technologies is a vertically integrated Original Design Manufacturer with 400+ engineers, 500+ clients, and 10M+ units manufactured.',
    timeline: [
      { year: '2024', event: 'Adopted Industry 4.0 standards. Full traceability, smart manufacturing, and 4th SMT line operational' },
      { year: '2025', event: 'Crossed 10 million units manufactured. Pioneering Industry 5.0 ecosystem' },
      { year: '2026', event: 'ISO 13485:2024 recertification with zero non-conformities. 40+ countries served' },
    ],
    highlights: [
      { icon: FiStar, title: '500+ Clients Worldwide', text: 'HDFC Bank, SBI, Apollo Hospitals, Indian Army, Indian Navy, IAF, Sun Pharma, Cipla, Paytm, BharatPe — we serve leading brands across healthcare, defence, banking, and pharmaceuticals.', stat: '500+' },
      { icon: FiCpu, title: '400+ Engineers', text: 'Our team spans R&D, embedded systems, AI/ML, PCB design (up to 12-layer HDI), mechanical engineering, firmware, cloud IoT, and manufacturing. 200+ products developed.', stat: '400+' },
      { icon: FiAward, title: 'Zero Non-Conformities', text: 'ISO 13485:2024 recertification achieved in March 2026 with zero non-conformities. Quality yield rate: 99.8%. Placement accuracy: 99.95%.', stat: '0' },
      { icon: FiSettings, title: 'Industry 5.0 Vision', text: 'AI-powered diagnostics, Digital Twin manufacturing, IoT-connected devices, and human-centric automation. Vision: 50+ countries by 2030.', stat: '2030' },
    ],
    splitContent: {
      title: 'What Makes Us Different',
      text: 'We are not just a manufacturer — we are an Original Design Manufacturer. That means we design, engineer, and build products from concept to mass production. Our clients don\'t just buy our manufacturing capacity — they buy our engineering expertise, our quality systems, and our ability to solve complex problems.',
      image: '/Walnut_About_Page_Images_Single/06_Cleanroom_Manufacturing.webp',
    },
    nextSlug: 'foundation',
    nextTitle: 'Foundation',
    nextColor: 'from-blue-600 to-blue-700',
  },
};

export default function EvolutionDetailPage() {
  const { slug } = useParams();
  const data = evolutionData[slug];
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <Link to="/about" className="text-blue-600 hover:underline">Back to About</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${data.title} - Our Journey`}
        description={data.intro}
        path={`/about/evolution/${slug}`}
      />

      {/* Parallax Hero */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.img
          src={data.heroImage}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: heroY, scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Link to="/about" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
                <FiArrowLeft className="w-4 h-4" />
                Back to About
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${data.color} text-white text-sm font-bold`}>
                  <span>{data.num}</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full" />
                  <span>{data.year}</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-display text-white mb-4 leading-none">
                {data.title}
              </h1>
              <p className="text-xl text-white/60 max-w-2xl">{data.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Big Statement */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r ${data.color} blur-3xl`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r ${data.color} blur-3xl`} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black font-display bg-gradient-to-r ${data.color} bg-clip-text text-transparent leading-tight`}>
              {data.bigStatement}
            </h2>
            <p className="text-lg text-slate-500 mt-6 max-w-2xl mx-auto">{data.intro}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`py-12 ${data.colorBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <span className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                  {h.stat}
                </span>
                <div className="text-sm text-slate-600 mt-1 font-medium">{h.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={data.splitContent.image}
                  alt={data.splitContent.title}
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${data.color} opacity-10`} />
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl bg-gradient-to-r ${data.color} opacity-20 blur-xl`} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className={`text-xs font-bold ${data.colorText} uppercase tracking-widest`}>The Story</span>
              <h3 className="text-3xl font-black text-slate-900 mt-2 mb-6">{data.splitContent.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{data.splitContent.text}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid — Highlights */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-slate-900 mb-12 text-center"
          >
            What Made This Chapter Special
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${data.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
                <div className="relative flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <h.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{h.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{h.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline — Horizontal */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-slate-900 mb-12 text-center"
          >
            Key Milestones
          </motion.h2>
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="grid grid-cols-3 gap-4">
              {data.timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${data.color} flex items-center justify-center shadow-xl mb-4`}>
                    <span className="text-sm font-black text-white">{item.year}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed px-2">{item.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next CTA */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r ${data.nextColor} opacity-10 blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r ${data.nextColor} opacity-10 blur-3xl`} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Next Chapter</span>
            <h2 className="text-4xl font-black text-white mt-3 mb-8">{data.nextTitle}</h2>
            <Link
              to={`/about/evolution/${data.nextSlug}`}
              className={`inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r ${data.nextColor} text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg`}
            >
              Explore {data.nextTitle}
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-8">
              <Link to="/about" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                Back to About Page
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
