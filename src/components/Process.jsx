import { motion } from 'framer-motion';
import {
  FiZap, FiSearch, FiEdit3, FiLayers, FiCheckCircle, FiSettings,
  FiShield, FiTruck, FiHeadphones, FiTrendingUp,
  FiWifi, FiGrid, FiPieChart, FiMonitor, FiCloud, FiActivity,
  FiAward, FiClock, FiDollarSign, FiHeart, FiLock, FiUsers, FiArrowRight
} from 'react-icons/fi';
import { process, industryFourTechnologies, impactBenefits } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

const stepIcons = {
  lightbulb: FiZap,
  search: FiSearch,
  design: FiEdit3,
  prototype: FiLayers,
  testing: FiCheckCircle,
  manufacturing: FiSettings,
  quality: FiShield,
  packaging: FiTruck,
  support: FiHeadphones,
  improvement: FiTrendingUp,
};

const stepImages = [
  '/3d image.webp',
  '/TDCS.webp',
  '/IOT lock smart.png',
  '/Pocket Soundbox.webp',
  '/BP-Gold-Standart-qtp66wfdztt00ify69tbdni4142gjk00uh6ziametw1.png',
  '/soundbox new.png',
  '/futuristic_medical_device_zoomed_out.png',
  '/neuro_rehab_device.png',
  '/soundbox new.png',
  '/soundbox new.png',
];

const techIcons = {
  iot: FiWifi,
  mes: FiGrid,
  ai: FiPieChart,
  twin: FiMonitor,
  cloud: FiCloud,
  robot: FiActivity,
};

const impactIcons = {
  'quality-badge': FiAward,
  speed: FiClock,
  cost: FiDollarSign,
  sustainable: FiHeart,
  security: FiLock,
  customer: FiUsers,
};

function ProcessSteps() {
  const { t } = useLanguage();
  const topRow = process.slice(0, 5);
  const bottomRow = process.slice(5, 10);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3">
            {t('process.title')}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t('process.subtitle')}
          </p>
        </motion.div>

        {/* Top Row - Steps 1-5 */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {topRow.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={stepImages[index]}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xs font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <div className="mt-3 text-center max-w-[120px]">
                  <p className="text-xs font-bold text-slate-900">{step.title.split(' & ')[0]}</p>
                  <p className="text-xs text-blue-600 font-medium">{step.subtitle}</p>
                </div>
              </motion.div>
              {index < topRow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="mx-2 md:mx-4"
                >
                  <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-blue-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Row - Steps 6-10 */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {bottomRow.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={stepImages[index + 5]}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                    <span className="text-xs font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <div className="mt-3 text-center max-w-[120px]">
                  <p className="text-xs font-bold text-slate-900">{step.title.split(' & ')[0]}</p>
                  <p className="text-xs text-blue-600 font-medium">{step.subtitle}</p>
                </div>
              </motion.div>
              {index < bottomRow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="mx-2 md:mx-4"
                >
                  <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-blue-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
            <FiWifi className="w-3.5 h-3.5" />
            {t('process.smartManufacturing')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            {t('process.poweredByIndustry')}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t('process.smartMfgDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industryFourTechnologies.map((tech, index) => {
            const Icon = techIcons[tech.icon];
            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">{tech.title}</h3>
                <p className="text-xs text-slate-500">{tech.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold mb-4">
            <FiAward className="w-3.5 h-3.5" />
            {t('process.ourCommitment')}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            {t('process.deliveringImpact')}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t('process.commitmentDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {impactBenefits.map((benefit, index) => {
            const Icon = impactIcons[benefit.icon];
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-0.5">{benefit.title}</h3>
                <p className="text-xs text-slate-500">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Process() {
  const { t } = useLanguage();
  return (
    <section id="process" className="relative bg-white">
      <ProcessSteps />
      <TechSection />
      <ImpactSection />
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden"
          >
            <div className="relative z-10 text-center">
              <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-3">
                {t('process.readyToStart')}
              </h2>
              <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
                {t('process.ctaDesc')}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors duration-300"
              >
                {t('process.getStarted')}
                <FiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
