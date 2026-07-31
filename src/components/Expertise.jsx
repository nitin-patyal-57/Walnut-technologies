import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FiArrowRight, FiZap, FiCpu, FiSettings, FiCheckCircle, FiShield, 
  FiGlobe, FiHeart, FiUsers, FiAward
} from 'react-icons/fi';

const capabilities = [
  {
    title: 'Engineering Excellence',
    description: 'Multidisciplinary engineering team delivering innovative and reliable solutions.',
    icon: FiCpu,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    title: 'Scalable Manufacturing',
    description: '150,000 sq. ft. facility with advanced automation for high-volume production.',
    icon: FiSettings,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  {
    title: 'Innovation Driven',
    description: 'Continuous R&D and rapid prototyping to turn ideas into impactful products.',
    icon: FiZap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-100',
  },
  {
    title: 'Quality & Compliance',
    description: 'Rigorous testing and adherence to international quality & regulatory standards.',
    icon: FiCheckCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
  {
    title: 'Global Delivery',
    description: 'Strong global supply chain and delivery excellence across 20+ countries.',
    icon: FiGlobe,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-100',
  },
  {
    title: 'Customer Partnership',
    description: 'Collaborative approach with end-to-end support and long-term relationships.',
    icon: FiUsers,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
  },
];

const stats = [
  { icon: FiSettings, value: '150,000+', label: 'Sq. Ft. Facility', color: 'text-blue-600' },
  { icon: FiCpu, value: '300,000+', label: 'Devices / Month', color: 'text-emerald-600' },
  { icon: FiUsers, value: '500+', label: 'Engineers', color: 'text-violet-600' },
  { icon: FiGlobe, value: '20+', label: 'Countries Served', color: 'text-amber-600' },
  { icon: FiAward, value: 'ISO', label: 'Certified', color: 'text-cyan-600' },
  { icon: FiHeart, value: '10+', label: 'Years of Excellence', color: 'text-rose-600' },
];

export default function Expertise() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-80px' });
  const capRef = useRef(null);
  const capInView = useInView(capRef, { once: true, margin: '-80px' });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section id="expertise" className="relative bg-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-100/50 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Our Expertise</span>
                <div className="w-12 h-[2px] bg-blue-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 mb-6 leading-tight">
                Expertise that powers{' '}
                <span className="text-blue-600">innovation.</span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                End-to-end capabilities, advanced technologies and uncompromising quality – delivering smart, reliable and future-ready solutions across industries.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <FiArrowRight className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Discover how we build<br />the technology of tomorrow
                </span>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/Design & Engineering.jpg"
                  alt="Expertise"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>
              
              {/* Decorative Border */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-blue-200 rounded-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div ref={capRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={capInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            WHERE EXPERTISE MEETS <span className="text-blue-600">EXCELLENCE</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                animate={capInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${cap.bgColor} border ${cap.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${cap.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{cap.description}</p>
                <div className={`w-10 h-[2px] mx-auto mt-4 ${cap.color.replace('text-', 'bg-')}`} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <Icon className={`w-6 h-6 ${stat.color} flex-shrink-0`} />
                  <div>
                    <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
