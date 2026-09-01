import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiArrowRight, FiShield, FiClock, FiGlobe, FiAward, FiPhone, FiMail } from 'react-icons/fi';
import { brand } from '../data/content';

const expertiseData = {
  'medical-electronics': {
    title: 'Medical Electronics',
    subtitle: 'Life-Critical Precision Manufacturing',
    heroImage: '/RTMS.webp',
    tagline: 'Engineering Trust in Every Heartbeat',
    intro: 'In healthcare, there is no margin for error. Walnut Technologies delivers ISO 13485 certified medical electronics that hospitals, clinics, and med-tech companies trust with patient lives. From concept to production, we manufacture devices that meet the most stringent global regulatory standards.',
    whyChooseUs: [
      'ISO 13485:2016 Certified Quality Management System',
      'Class 10K Cleanroom Facility for Sterile Assembly',
      'FDA QSR Compliant Manufacturing Processes',
      'IEC 60601 Electrical Safety Testing',
      'Complete Traceability from Component to Finished Product',
      'Zero Defect Manufacturing Philosophy',
    ],
    capabilities: [
      { title: 'Patient Monitoring Systems', description: 'Multi-parameter monitors with real-time data acquisition, alarm management, and clinical decision support integration.' },
      { title: 'Diagnostic Equipment', description: 'Precision diagnostic devices including BP monitors, oximeters, and spirometers with laboratory-grade accuracy.' },
      { title: 'Therapeutic Devices', description: 'NEBULIZERS, TENS units, and rehabilitation systems designed for consistent therapeutic output.' },
      { title: 'Oxygen Therapy', description: 'Oxygen concentrators and delivery systems with flow precision and purity certification.' },
      { title: 'Surgical Instruments', description: 'Electrosurgical units and powered surgical tools with biocompatible materials and sterilization compatibility.' },
      { title: 'Telehealth Solutions', description: 'Connected medical devices with cloud integration for remote patient monitoring and data analytics.' },
    ],
    stats: [
      { value: '500K+', label: 'Units Manufactured Monthly' },
      { value: '99.8%', label: 'Quality Yield Rate' },
      { value: '20+', label: 'Countries Supplied' },
      { value: '15+', label: 'Years Experience' },
    ],
    certifications: ['ISO 13485', 'FDA QSR', 'CE Marking', 'IEC 60601', 'ISO 9001', 'BIS Certified'],
    process: [
      'Design for Manufacturing (DFM) Review',
      'Component Sourcing & Incoming Inspection',
      'SMT Assembly & Through-Hole Manufacturing',
      'Conformal Coating & Potting',
      'Functional Testing & Calibration',
      'Cleanroom Assembly & Packaging',
      'Final Quality Audit & Release',
    ],
    cta: 'Partner with us to bring life-saving medical devices to market faster, with the quality and compliance your patients deserve.',
  },
  'embedded-electronic-and-iot': {
    title: 'Embedded Electronic and IoT',
    subtitle: 'Intelligent Connected Systems',
    heroImage: '/Embedded Electronics & IoT.webp',
    tagline: 'Where Intelligence Meets Connectivity',
    intro: 'The future belongs to smart, connected devices. Walnut Technologies designs and manufactures embedded systems and IoT solutions that transform everyday objects into intelligent, data-driven assets. Our vertically integrated capabilities ensure seamless hardware-software integration from prototype to mass production.',
    whyChooseUs: [
      'Full-Stack Embedded Design: Hardware, Firmware & Cloud',
      'ARM/Cortex-M, ESP32, Raspberry Pi Platform Expertise',
      'BLE, WiFi, LoRa, NB-IoT Connectivity Options',
      'Edge Computing & AI/ML Integration',
      'OTA Update Infrastructure',
      'Cybersecurity by Design',
    ],
    capabilities: [
      { title: 'Custom Firmware Development', description: 'Bare-metal and RTOS-based firmware for ARM Cortex-M, RISC-V, and ESP32 microcontrollers with power optimization.' },
      { title: 'IoT Gateway Design', description: 'Multi-protocol gateways aggregating sensor data with edge processing and cloud connectivity.' },
      { title: 'Sensor Integration', description: 'Precision sensor arrays for environmental, industrial, and medical applications with calibrated accuracy.' },
      { title: 'Cloud IoT Platforms', description: 'AWS IoT, Azure IoT Hub, and custom cloud backends for device management and data analytics.' },
      { title: 'Mobile Companion Apps', description: 'iOS and Android applications for device configuration, monitoring, and user interaction.' },
      { title: 'OTA & Fleet Management', description: 'Over-the-air update systems and device fleet management for large-scale deployments.' },
    ],
    stats: [
      { value: '100+', label: 'IoT Products Deployed' },
      { value: '50M+', label: 'Data Points Processed Daily' },
      { value: '99.9%', label: 'System Uptime' },
      { value: '<50ms', label: 'Response Latency' },
    ],
    certifications: ['CE', 'FCC', 'Wi-Fi Alliance', 'Bluetooth SIG', 'BIS'],
    process: [
      'Requirements Analysis & System Architecture',
      'Hardware Design & Prototype',
      'Firmware Development & Unit Testing',
      'Cloud Backend & API Development',
      'Mobile App Integration',
      'System Integration & Validation',
      'Pilot Deployment & Optimization',
      'Mass Production & OTA Infrastructure',
    ],
    cta: 'Transform your product line with intelligent connected devices. Let us engineer the embedded brains and IoT backbone your customers demand.',
  },
  'ip-oriented-product': {
    title: 'IP Oriented Product',
    subtitle: 'Innovation Protected, Value Multiplied',
    heroImage: '/IP Oriented Product.webp',
    tagline: 'Your Vision, Our Innovation, Protected IP',
    intro: 'Intellectual Property is the currency of modern business. Walnut Technologies partners with companies to develop proprietary products that become competitive moats. Our NDA-protected development process ensures your innovations remain exclusively yours while we handle the complex engineering and manufacturing.',
    whyChooseUs: [
      'Strict NDA & IP Protection Protocols',
      'Complete Ownership Transfer of All Design Files',
      'Patent-Ready Documentation & Support',
      'Proprietary Algorithm Implementation',
      'Secure Development Environment',
      'Competitive Product Differentiation',
    ],
    capabilities: [
      { title: 'Product Conceptualization', description: 'From idea generation to feasibility studies, we help shape your product vision into market-ready solutions.' },
      { title: 'Industrial Design', description: 'Ergonomic, aesthetically distinctive product design that communicates premium quality and brand identity.' },
      { title: 'Mechanical Engineering', description: 'CAD modeling, FEA analysis, tolerance optimization, and design for manufacturing.' },
      { title: 'Electronics Design', description: 'Custom schematic capture, PCB layout, signal integrity analysis, and EMC compliance design.' },
      { title: 'Firmware & Software', description: 'Proprietary firmware, embedded software, and application layers with full source code delivery.' },
      { title: 'Certification Management', description: 'End-to-end regulatory certification including CE, FCC, UL, and industry-specific approvals.' },
    ],
    stats: [
      { value: '200+', label: 'Products Developed' },
      { value: '100%', label: 'IP Ownership Transfer' },
      { value: '50+', label: 'Patents Supported' },
      { value: '100%', label: 'NDA Compliance' },
    ],
    certifications: ['NDA Protected', 'IP Transfer Certified', 'ISO 27001 Ready', 'GDPR Compliant'],
    process: [
      'NDA Execution & Requirements Workshop',
      'Market Research & Competitive Analysis',
      'Concept Design & Feasibility Study',
      'Detailed Design & Engineering',
      'Prototype Development & Validation',
      'Design Verification & Testing',
      'Certification & Compliance',
      'Documentation & IP Handover',
      'Manufacturing Setup & Transfer',
    ],
    cta: 'Your ideas deserve protection and flawless execution. Partner with us to turn your vision into market-leading products with complete IP ownership.',
  },
  'pcb-design-development': {
    title: 'PCB Design & Development',
    subtitle: 'Foundation of Every Great Product',
    heroImage: '/Design & Engineering.webp',
    tagline: 'Precision at Every Layer',
    intro: 'Every exceptional electronic product begins with an exceptional PCB. Walnut Technologies delivers advanced PCB design and fabrication services supporting up to 12-layer HDI technology. Our engineering team optimizes for signal integrity, thermal management, and manufacturability — ensuring your boards perform flawlessly from prototype to production.',
    whyChooseUs: [
      'Up to 12-Layer HDI PCB Design',
      'Advanced Impedance Control & Signal Integrity',
      'RF & High-Speed Digital Design Expertise',
      'Flex & Rigid-Flex PCB Capabilities',
      'DFM/DFA Optimization for Yield',
      'Rapid Prototyping in 24-48 Hours',
    ],
    capabilities: [
      { title: 'Schematic Design', description: 'Complex multi-sheet schematics with hierarchical design, parameterized components, and design rule management.' },
      { title: 'PCB Layout', description: 'High-density board layout with controlled impedance routing, length matching, and differential pair routing.' },
      { title: 'Signal Integrity Analysis', description: 'Eye diagram analysis, crosstalk simulation, and power integrity optimization for high-speed designs.' },
      { title: 'Thermal Management', description: 'Thermal simulation, heat sink design, and copper pour optimization for power electronics.' },
      { title: 'Prototype Fabrication', description: 'In-house rapid prototyping with 24-48 hour turnaround for design validation and testing.' },
      { title: 'Volume Manufacturing', description: 'Seamless transition from prototype to production with panel optimization and automated assembly.' },
    ],
    stats: [
      { value: '12', label: 'Layer HDI Capability' },
      { value: '24hr', label: 'Prototype Turnaround' },
      { value: '99.5%', label: 'First-Pass Yield' },
      { value: '10K+', label: 'Boards Designed' },
    ],
    certifications: ['IPC-A-600', 'IPC-A-610', 'ISO 9001', 'UL Certified', 'RoHS Compliant'],
    process: [
      'Schematic Capture & Design Review',
      'Component Library Creation',
      'PCB Layout & Routing',
      'Design Rule Check (DRC)',
      'Signal/Power Integrity Analysis',
      'Gerber Generation & Manufacturing Outputs',
      'Prototype Fabrication & Assembly',
      'Testing & Design Validation',
    ],
    cta: 'From a single prototype to millions of boards, we deliver PCB solutions that power the products your customers rely on.',
  },
  'it-electronics': {
    title: 'IT Electronics',
    subtitle: 'Powering Digital Infrastructure',
    heroImage: '/IT Electronics.webp',
    tagline: 'Reliable Hardware for Uninterrupted Digital Operations',
    intro: 'The backbone of modern business runs on reliable IT electronics. Walnut Technologies manufactures high-performance computing hardware, networking equipment, and data center solutions that keep enterprises connected and running. Our products are built for 24/7 operation in mission-critical environments.',
    whyChooseUs: [
      'Enterprise-Grade Hardware Design',
      '24/7 Operation Reliability Testing',
      'Thermal Management for Data Centers',
      'Redundant Power Supply Design',
      'Network Equipment Certification',
      'Custom Form Factor Solutions',
    ],
    capabilities: [
      { title: 'Server Hardware', description: 'Custom server platforms optimized for compute density, storage capacity, and power efficiency.' },
      { title: 'Network Equipment', description: 'Switches, routers, and access points with enterprise-grade reliability and management features.' },
      { title: 'Storage Solutions', description: 'NAS, SAN, and JBOD systems with RAID support and hot-swap capabilities.' },
      { title: 'Edge Computing', description: 'Compact, ruggedized computing platforms for edge deployment in harsh environments.' },
      { title: 'UPS & Power Systems', description: 'Intelligent power management with battery backup and automatic failover.' },
      { title: 'KVM & Display Systems', description: 'Video wall controllers, KVM switches, and display management solutions.' },
    ],
    stats: [
      { value: '99.99%', label: 'System Availability' },
      { value: '24/7', label: 'Operation Rating' },
      { value: '50K+', label: 'Units Deployed' },
      { value: '5yr', label: 'Product Lifecycle' },
    ],
    certifications: ['CE', 'FCC', 'UL', 'BIS', 'ISO 9001'],
    process: [
      'Requirements Gathering & Architecture',
      'System Design & Component Selection',
      'Prototype Build & Thermal Testing',
      'Reliability & Stress Testing',
      'Certification & Compliance',
      'Pilot Production Run',
      'Full-Scale Manufacturing',
      'Quality Assurance & Shipping',
    ],
    cta: 'Build your IT infrastructure on hardware that never quits. Let us engineer the reliable backbone your digital operations demand.',
  },
  'iot-software-development': {
    title: 'IoT Software Development',
    subtitle: 'Intelligence at Scale',
    heroImage: '/IoT Software Development.webp',
    tagline: 'Software That Makes Hardware Smart',
    intro: 'Hardware without intelligent software is just metal and silicon. Walnut Technologies develops robust, scalable IoT software platforms that transform connected devices into powerful data engines. From device firmware to cloud analytics, we build the digital nervous system that powers modern IoT ecosystems.',
    whyChooseUs: [
      'Full-Stack IoT Software Expertise',
      'Real-Time Data Processing at Scale',
      'AI/ML Integration for Predictive Analytics',
      'Multi-Cloud Support (AWS, Azure, GCP)',
      'Secure API Architecture',
      'White-Label Solutions Available',
    ],
    capabilities: [
      { title: 'Device Firmware', description: 'Lightweight, power-efficient firmware for microcontrollers with OTA update capability and secure boot.' },
      { title: 'Cloud Backend', description: 'Scalable microservices architecture handling millions of device connections and data streams.' },
      { title: 'Data Analytics', description: 'Real-time dashboards, historical analytics, and machine learning models for predictive insights.' },
      { title: 'Mobile Applications', description: 'Cross-platform mobile apps for device configuration, monitoring, and user engagement.' },
      { title: 'API & Integration', description: 'RESTful and GraphQL APIs for third-party integration and ecosystem connectivity.' },
      { title: 'Security Framework', description: 'End-to-end encryption, certificate management, and security monitoring for IoT deployments.' },
    ],
    stats: [
      { value: '1M+', label: 'Devices Managed' },
      { value: '99.95%', label: 'Platform Uptime' },
      { value: '10TB', label: 'Data Processed Monthly' },
      { value: '<100ms', label: 'API Response Time' },
    ],
    certifications: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA Ready', 'PCI DSS'],
    process: [
      'Platform Architecture Design',
      'Microservices Development',
      'Device SDK & Firmware',
      'Cloud Infrastructure Setup',
      'API Development & Documentation',
      'Frontend Dashboard & Mobile App',
      'Security Audit & Penetration Testing',
      'Performance Optimization',
      'Deployment & Monitoring Setup',
    ],
    cta: 'Unlock the full potential of your connected devices with software that scales, secures, and delivers actionable insights.',
  },
  'large-scale-manufacturing': {
    title: 'Large Scale Manufacturing',
    subtitle: 'Volume Without Compromise',
    heroImage: '/contract manufacturing.webp',
    tagline: 'From Prototype to Millions, Flawlessly',
    intro: 'Scaling from prototype to mass production is where most companies stumble. Not Walnut Technologies. With 4 advanced SMT lines, 300,000+ units monthly capacity, and a 150,000 sq.ft state-of-the-art facility, we deliver consistent quality at volumes that fuel global market demands. Our vertically integrated operations eliminate bottlenecks and ensure on-time delivery.',
    whyChooseUs: [
      '4 High-Speed SMT Production Lines',
      '500K+ Units Monthly Capacity',
      '150,000 Sq.Ft Manufacturing Facility',
      'Vertical Integration: PCB to Final Assembly',
      'Class 10K Cleanroom for Sensitive Products',
      'Automated Optical Inspection (AOI)',
    ],
    capabilities: [
      { title: 'SMT Assembly', description: 'High-speed surface mount placement with 0201 component capability and 99.95% placement accuracy.' },
      { title: 'Through-Hole Assembly', description: 'Wave soldering, selective soldering, and manual assembly for mixed-technology boards.' },
      { title: 'Box Build Assembly', description: 'Complete product assembly including mechanical, electrical, and cosmetic finishing.' },
      { title: 'Conformal Coating', description: 'Protective coating application for moisture, dust, and chemical resistance.' },
      { title: 'Testing & Inspection', description: 'In-circuit testing, functional testing, burn-in testing, and automated optical inspection.' },
      { title: 'Packaging & Logistics', description: 'Custom packaging design, labeling, and global shipping coordination.' },
    ],
    stats: [
      { value: '500K+', label: 'Units Per Month' },
      { value: '4', label: 'SMT Lines' },
      { value: '99.8%', label: 'First-Pass Yield' },
      { value: '150K', label: 'Sq.Ft Facility' },
    ],
    certifications: ['ISO 9001', 'ISO 13485', 'IATF 16949', 'IPC-A-610', 'J-STD-001'],
    process: [
      'Design for Manufacturing (DFM) Review',
      'Bill of Materials Optimization',
      'Component Procurement & Kitting',
      'SMT Stencil & Setup',
      'Solder Paste Inspection (SPI)',
      'Component Placement & Reflow',
      'Automated Optical Inspection (AOI)',
      'In-Circuit & Functional Testing',
      'Conformal Coating & Potting',
      'Box Build & Final Assembly',
      'Burn-In & Reliability Testing',
      'Final QC & Packaging',
    ],
    cta: 'Stop worrying about production scalability. We have the capacity, capability, and quality systems to manufacture your products at any volume.',
  },
  'payment-systems': {
    title: 'Payment Systems',
    subtitle: 'Secure Transaction Infrastructure',
    heroImage: '/paytm soundbox.webp',
    tagline: 'Trust in Every Transaction',
    intro: 'In the payment ecosystem, security and reliability are non-negotiable. Walnut Technologies manufactures PCI PTS 5.x certified payment terminals, QR soundboxes, and transaction processing hardware that banks, fintechs, and retailers trust with billions of dollars in daily transactions. Our products meet the highest security standards while delivering exceptional user experience.',
    whyChooseUs: [
      'PCI PTS 5.x Certified Hardware',
      'NPCI & RBI Compliant Products',
      'EMV Level 1 & 2 Certified',
      'Secure Element Integration',
      'Tamper-Resistant Design',
      'Multi-Payment Network Support',
    ],
    capabilities: [
      { title: 'Smart POS Terminals', description: 'Android-based POS devices with EMV, NFC, biometric authentication, and receipt printing.' },
      { title: 'QR Soundboxes', description: 'Audio confirmation devices for QR payments supporting Paytm, PhonePe, Google Pay, and more.' },
      { title: 'Card Readers', description: 'Magstripe, EMV chip, and contactless card readers for payment processing.' },
      { title: 'Payment Gateways', description: 'Hardware integration with major payment gateways and banking networks.' },
      { title: 'Security Modules', description: 'Tamper detection, secure boot, and encrypted communication modules.' },
      { title: 'Fleet Management', description: 'Remote device management, OTA updates, and performance monitoring.' },
    ],
    stats: [
      { value: '1M+', label: 'Terminals Deployed' },
      { value: '₹100Cr+', label: 'Daily Transactions' },
      { value: '99.99%', label: 'Uptime SLA' },
      { value: '15+', label: 'Payment Networks' },
    ],
    certifications: ['PCI PTS 5.x', 'EMV L1/L2', 'NPCI', 'RBI', 'CE', 'FCC'],
    process: [
      'Security Requirements Analysis',
      'Secure Hardware Design',
      'Secure Element Integration',
      'Firmware Development',
      'Payment Application Development',
      'EMV & PCI Testing',
      'NPCI Certification',
      'Pilot Deployment',
      'Mass Production',
      'Post-Deployment Monitoring',
    ],
    cta: 'Join the banks and fintechs who trust us to manufacture their payment infrastructure. Security, compliance, and reliability — guaranteed.',
  },
};

export default function ExpertiseDetailPage() {
  const { slug } = useParams();
  const data = expertiseData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Expertise Not Found</h1>
          <p className="text-slate-500 mb-6">The expertise page you're looking for doesn't exist.</p>
          <Link to="/expertise" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            Back to Expertise
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/expertise"
            className="inline-flex items-center gap-2 mb-8 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            All Expertise
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                {data.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                {data.title}
              </h1>
              <p className="text-xl text-blue-400 font-display italic mb-6">{data.tagline}</p>
              <p className="text-base text-slate-300 leading-relaxed max-w-lg">{data.intro}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                <img
                  src={data.heroImage}
                  alt={data.title}
                  className="w-full h-[350px] md:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold font-display text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FiShield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Why Choose Walnut</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-6">
                Your Trusted Manufacturing Partner
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                We don't just manufacture products — we build partnerships. Our commitment to quality, transparency, and innovation has made us the preferred ODM partner for companies across 20+ countries.
              </p>
              
              <div className="space-y-4">
                {data.whyChooseUs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FiAward className="w-5 h-5 text-blue-600" />
                Certifications & Compliance
              </h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {data.certifications.map((cert) => (
                  <span key={cert} className="px-4 py-2 text-sm font-medium bg-white text-blue-700 rounded-xl border border-blue-200 shadow-sm">
                    {cert}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-blue-600" />
                Our Process
              </h3>
              <div className="space-y-3">
                {data.process.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
              Our <span className="text-blue-600">Capabilities</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              End-to-end solutions tailored to your specific industry requirements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <FiCheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
                    Ready to Start Your Project?
                  </h2>
                  <p className="text-slate-300 text-lg leading-relaxed mb-8">{data.cta}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
                    >
                      Start Your Project
                      <FiArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                      href={`tel:${brand.phone}`}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
                    >
                      <FiPhone className="w-5 h-5" />
                      Call Us Now
                    </a>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
                  <div className="space-y-4">
                    <a href={`tel:${brand.phone}`} className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                      <FiPhone className="w-5 h-5 text-blue-400" />
                      <span>{brand.phone}</span>
                    </a>
                    <a href={`mailto:${brand.email}`} className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                      <FiMail className="w-5 h-5 text-blue-400" />
                      <span>{brand.email}</span>
                    </a>
                    <div className="flex items-start gap-4 text-slate-300">
                      <FiGlobe className="w-5 h-5 text-blue-400 mt-0.5" />
                      <span>{brand.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
