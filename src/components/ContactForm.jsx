import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSend, FiCheck, FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import { brand } from '../data/content';
import { captureLead } from '../hooks/useLeads';

export default function ContactForm({ onOpenQuote }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    captureLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: form.message,
      source: 'contact-form',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="section-padding relative bg-slate-50">
      
      <div ref={ref} className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-label mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Get in Touch
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mb-3">
            Partner{' '}
            <span className="gradient-text">With Us</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Ready to start your project? Reach out and our team will respond within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-dark-950 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-800/70 text-dark-500 flex items-center justify-center shrink-0">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-950">Office Address</p>
                      <p className="text-xs text-dark-500 mt-0.5">{brand.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-800/70 text-dark-500 flex items-center justify-center shrink-0">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-950">Email</p>
                      <p className="text-xs text-dark-500 mt-0.5">{brand.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-800/70 text-dark-500 flex items-center justify-center shrink-0">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-950">Phone</p>
                      <p className="text-xs text-dark-500 mt-0.5">{brand.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-dark-800/70 text-dark-500 flex items-center justify-center shrink-0">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-950">Business Hours</p>
                      <p className="text-xs text-dark-500 mt-0.5">Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-dark-950 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={onOpenQuote}
                    className="w-full py-3 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                  >
                    Request a Quote
                  </button>
                  <a
                    href={`https://wa.me/917719463719`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 text-sm font-medium text-dark-400 border border-dark-600 hover:border-dark-500 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6 lg:p-8"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}                   className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-dark-500 mb-1.5">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm" placeholder="+91 77194 63719" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-dark-500 mb-1.5">Company</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm" placeholder="Company name" />
                    </div>
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Message *</label>
                      <textarea required rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors resize-none shadow-sm" placeholder="Tell us about your project requirements..." />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-dark-950 mb-2">Message Sent!</h4>
                  <p className="text-sm text-dark-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="glass-card p-2 overflow-hidden rounded-2xl">
            <iframe
              title="Walnut Technologies Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1234567890123!2d76.68999999999999!3d30.709999999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0b3d3d3d3d%3A0x1234567890abcdef!2sJLPL%20Industrial%20Park%2C%20Sector%2082%2C%20Mohali%2C%20Punjab%20160055!5e0!3m2!1sen!2sin!4v1234567890123"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
