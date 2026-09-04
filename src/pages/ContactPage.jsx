import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiMail, FiPhone, FiClock, FiSend, FiCheck,
  FiArrowRight, FiHome, FiServer, FiHeadphones,
  FiShield, FiUsers, FiBox, FiMessageCircle
} from 'react-icons/fi';
import { brand } from '../data/content';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { sendContactEmail } from '../utils/sendEmail';

export default function ContactPage({ onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', subject: '', message: '', privacy: false });
  const [submitted, setSubmitted] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const contactCards = [
    {
      icon: FiHome,
      title: t('contact.headOffice'),
      lines: ['Walnut Technologies Pvt. Ltd.', '132 JLPL Industrial Park', 'Sector 82, Mohali Punjab 160055'],
      link: 'https://maps.google.com/?q=JLPL+Industrial+Park+Sector+82+Mohali',
      linkText: t('contact.getDirections'),
    },
    {
      icon: FiServer,
      title: t('contact.manufacturing'),
      lines: ['150,000+ Sq. Ft. Facility', 'Phase 5, Industrial Area,', 'Mohali, Punjab 160055, India'],
      link: 'https://maps.google.com/?q=JLPL+Industrial+Park+Sector+82+Mohali',
      linkText: t('contact.getDirections'),
    },
    {
      icon: FiMail,
      title: t('contact.emailUs'),
      lines: ['contact@walnutmedical.in'],
      link: 'mailto:contact@walnutmedical.in',
      linkText: null,
    },
    {
      icon: FiPhone,
      title: t('contact.callUs'),
      lines: ['+91 77194 63719'],
      link: 'tel:+917719463719',
      linkText: null,
    },
  ];

  const whyConnect = [
    { icon: FiMessageCircle, title: t('contact.productInquiries'), desc: t('contact.productInquiriesDesc') },
    { icon: FiUsers, title: t('contact.partnerships'), desc: t('contact.partnershipsDesc') },
    { icon: FiHeadphones, title: t('contact.careersTitle'), desc: t('contact.careersDesc') },
    { icon: FiShield, title: t('contact.techSupport'), desc: t('contact.techSupportDesc') },
  ];

  const stats = [
    { icon: FiClock, value: '2016', label: t('about.trustedSince') },
    { icon: FiServer, value: '150,000+', label: t('contact.sqFtFacility') },
    { icon: FiBox, value: '500K+', label: t('contact.monthlyCapacity') },
    { icon: FiUsers, value: '400+', label: t('stats.engineers') },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendContactEmail(form);
    setSubmitted(true);
    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', company: '', email: '', phone: '', subject: '', message: '', privacy: false });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact Us"
        description="Get in touch with Walnut Technologies. Located in Mohali, Punjab, India. Contact us for OEM/ODM manufacturing, medical devices, payment systems, and custom electronics inquiries."
        path="/contact"
        keywords="contact Walnut Technologies, electronics manufacturer contact, OEM inquiry, medical device manufacturer India"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50">
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold text-blue-600 tracking-wider uppercase mb-4">
                {t('nav.contact')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-slate-900 leading-tight mb-6">
                {t('contact.title')}
              </h1>
              <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-lg">
                {t('contact.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:+917719463719"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  <FiPhone className="w-4 h-4" />
                  {t('contact.callUs')}
                </a>
                <a
                  href="mailto:contact@walnutmedical.in"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:border-slate-400 hover:bg-white transition-all"
                >
                  <FiMail className="w-4 h-4" />
                  {t('contact.emailUs')}
                </a>
              </div>
            </motion.div>

            {/* Right - Building Image + Expert Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/contactbackground.webp"
                  alt="Walnut Technologies Manufacturing Facility"
                  className="w-full h-[300px] lg:h-[380px] object-cover"
                />
              </div>
              {/* Expert Card */}
              <div className="absolute -bottom-6 right-4 lg:right-8 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiHeadphones className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t('contact.talkExpert')}</p>
                  <p className="text-blue-600 font-bold">+91 77194 63719</p>
                  <p className="text-xs text-slate-400">{t('contact.monSat')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="text-center p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{card.title}</h3>
                  <div className="space-y-0.5 mb-3">
                    {card.lines.map((line, i) => (
                      <p key={i} className="text-xs text-slate-500">{line}</p>
                    ))}
                  </div>
                  {card.link && (
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {card.linkText || card.lines[0]}
                      <FiArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">{t('contact.sendMessage')}</h2>
              <p className="text-sm text-slate-500 mb-6">{t('contact.formSubtitle')}</p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.fullName')} *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder={t('contact.fullName')}
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.companyName')}</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({...form, company: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder={t('contact.companyName')}
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.emailAddress')} *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.phoneNumber')}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.subject')} *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="">{t('contact.selectSubject')}</option>
                      <option value="product">{t('contact.productInquiry')}</option>
                      <option value="quote">{t('contact.requestQuote')}</option>
                      <option value="partnership">{t('contact.partnership')}</option>
                      <option value="support">{t('contact.technicalSupport')}</option>
                      <option value="careers">{t('contact.careers')}</option>
                      <option value="other">{t('contact.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">{t('contact.message')} *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder={t('contact.messagePlaceholder')}
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      required
                      checked={form.privacy}
                      onChange={(e) => setForm({...form, privacy: e.target.checked})}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-xs text-slate-500">
                      {t('contact.agreeTo')}{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">{t('contact.privacyPolicy')}</Link>
                      {' '}{t('contact.and')}{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">{t('contact.terms')}</Link>.
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {t('contact.send')}
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border border-slate-200"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{t('contact.sent')}</h4>
                  <p className="text-sm text-slate-500">{t('contact.sentDesc')}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <iframe
                  title="Walnut Technologies Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.823456789!2d76.68999999999999!3d30.709999999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0b3d3d3d3d%3A0x1234567890abcdef!2sJLPL%20Industrial%20Park%2C%20Sector%2082%2C%20Mohali%2C%20Punjab%20160055!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>

              {/* Why Connect */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{t('contact.whyConnect')}</h3>
                <div className="space-y-4">
                  {whyConnect.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Left - Brand */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">W</span>
              </div>
              <div>
                <p className="text-sm text-slate-600 max-w-xs">
                  {t('contact.trustedBy')}
                </p>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
