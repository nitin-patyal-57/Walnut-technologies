import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import Modal from './Modal';
import { captureLead } from '../hooks/useLeads';

const productOptions = [
  'Medical Device',
  'Payment Terminal',
  'IoT Device',
  'Industrial Electronics',
  'Custom Electronics',
  'PCB Fabrication',
  'Other',
];

export default function QuoteModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    quantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    captureLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      product: form.product,
      quantity: form.quantity,
      message: form.message,
      source: 'quote-modal',
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', company: '', product: '', quantity: '', message: '' });
    }, 2000);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors shadow-sm";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Quote" size="max-w-lg">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Fill in your details and we'll get back to you with custom pricing for your project within 24 hours.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="your@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="+91 77194 63719" />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input type="text" value={form.company} onChange={(e) => updateField('company', e.target.value)} className={inputClass} placeholder="Company name" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Product Type *</label>
            <select required value={form.product} onChange={(e) => updateField('product', e.target.value)} className={inputClass}>
              <option value="">Select product type</option>
              {productOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Estimated Quantity</label>
            <input type="number" value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} className={inputClass} placeholder="e.g., 10,000" />
          </div>

          <div>
            <label className={labelClass}>Message</label>
            <textarea value={form.message} onChange={(e) => updateField('message', e.target.value)} rows={3} className={inputClass + " resize-none"} placeholder="Tell us about your project requirements..." />
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
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Quote Request Sent!</h4>
          <p className="text-sm text-slate-500">Our team will get back to you within 24 hours with a custom quote.</p>
        </motion.div>
      )}
    </Modal>
  );
}
