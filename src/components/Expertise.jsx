import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const expertiseAreas = [
  {
    title: 'Medical Electronics',
    slug: 'medical-electronics',
    description: 'Advanced electronic systems designed for healthcare, ensuring precision and reliability in critical medical operations.',
    image: '/RTMS.png',
  },
  {
    title: 'Embedded Electronic and IoT',
    slug: 'embedded-electronic-and-iot',
    description: 'Integrating smart tech into our day to day use devices, enabling seamless connectivity and enhanced functionality for IoT ecosystems.',
    image: '/Embedded Electronics & IoT.jpg',
  },
  {
    title: 'IP Oriented Product',
    slug: 'ip-oriented-product',
    description: 'Innovative products using intellectual property (IP) for a competitive edge and unique tech solutions for a company.',
    image: '/IP Oriented Product.jpg',
  },
  {
    title: 'PCB Design & Development',
    slug: 'pcb-design-development',
    description: 'Custom PCB solutions from concept design to production, optimizing performance and reliability for various applications.',
    image: '/Design & Engineering.jpg',
  },
  {
    title: 'IT Electronics',
    slug: 'it-electronics',
    description: 'Advanced electronic solutions tailored for IT infrastructure, boosting efficiency and performance across digital environments.',
    image: '/IT Electronics.jpg',
  },
  {
    title: 'IoT Software Development',
    slug: 'iot-software-development',
    description: 'Creating robust and scalable software solutions to power IoT devices, ensuring seamless integration and real-time data processing.',
    image: '/IoT Software Development.jpg',
  },
  {
    title: 'Large Scale Manufacturing',
    slug: 'large-scale-manufacturing',
    description: 'High volume of production capabilities delivering quality electronics at scale, meeting market demands of the world.',
    image: '/contract manufacturing.jpg',
  },
  {
    title: 'Payment Systems',
    slug: 'payment-systems',
    description: 'Creating robust and scalable Payment solutions to support all types of industries, ensuring efficiency and security.',
    image: '/paytm soundbox.png',
  },
];

export default function Expertise() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-80px' });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section id="expertise" className="relative bg-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-cyan-100/50 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-blue-200 rounded-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expertise Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            WHERE EXPERTISE MEETS <span className="text-blue-600">EXCELLENCE</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseAreas.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <Link to={`/expertise/${item.slug}`} className="block h-full">
                <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-500 shadow-sm hover:shadow-xl h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 group-hover:text-blue-500 transition-colors">
                      Learn More
                      <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
