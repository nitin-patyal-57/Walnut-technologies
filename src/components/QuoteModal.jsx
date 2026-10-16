import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import Modal from './Modal';
import Button from './ui/Button';
import { captureLead } from '../hooks/useLeads';
import { sendQuoteEmail } from '../utils/sendEmail';
import { useLanguage } from '../context/LanguageContext';

export default function QuoteModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    quantity: '',
    message: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const formTimeRef = useRef(Date.now());

  useEffect(() => {
    if (isOpen) {
      formTimeRef.current = Date.now();
      setError('');
      setFieldErrors({});
    }
  }, [isOpen]);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mirrors the server rules in api/contact.js so the user is told which
  // field is wrong before anything goes over the network.
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('quote.errors.name');
    if (!form.email.trim()) errs.email = t('quote.errors.email');
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = t('quote.errors.emailInvalid');
    if (!form.product) errs.product = t('quote.errors.product');
    if (!form.message.trim()) errs.message = t('quote.errors.message');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errs = validate();
    setFieldErrors(errs);
    const missing = Object.keys(errs);
    if (missing.length) {
      // Move focus to the first field that needs attention.
      document.getElementById(`quote-${missing[0]}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
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
      await sendQuoteEmail({ ...form, formTime: formTimeRef.current.toString() });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', company: '', product: '', quantity: '', message: '', website: '' });
        formTimeRef.current = Date.now();
      }, 2000);
    } catch (err) {
      // Show what the server actually said ("Message is required", a length
      // cap, a rate limit) rather than a generic apology.
      const serverMsg = err?.message;
      setError(serverMsg && serverMsg !== 'Failed to submit form' ? serverMsg : t('quote.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the inline error as soon as the user starts fixing it.
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const errClass = (field) => (fieldErrors[field] ? ' border-red-400 focus:ring-red-500 focus:border-red-500' : '');
  const fieldError = (field) =>
    fieldErrors[field] ? (
      <p role="alert" className="text-xs text-red-600 mt-1">{fieldErrors[field]}</p>
    ) : null;

  const productOptions = t('quote.productOptions');

  const inputClass = "w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('quote.title')} size="max-w-lg">
      {!submitted ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            {t('quote.instruction')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-name" className={labelClass}>{t('quote.name')} *</label>
              <input id="quote-name" type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass + errClass('name')} placeholder={t('quote.name')} maxLength={100} aria-invalid={!!fieldErrors.name} />
              {fieldError('name')}
            </div>
            <div>
              <label htmlFor="quote-email" className={labelClass}>{t('quote.email')} *</label>
              <input id="quote-email" type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass + errClass('email')} placeholder="your@email.com" aria-invalid={!!fieldErrors.email} />
              {fieldError('email')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quote-phone" className={labelClass}>{t('quote.phone')}</label>
              <input id="quote-phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="+91 77194 63719" />
            </div>
            <div>
              <label htmlFor="quote-company" className={labelClass}>{t('quote.company')}</label>
              <input id="quote-company" type="text" value={form.company} onChange={(e) => updateField('company', e.target.value)} className={inputClass} placeholder={t('quote.company')} maxLength={100} />
            </div>
          </div>

          <div>
            <label htmlFor="quote-product" className={labelClass}>{t('quote.productType')} *</label>
            <select id="quote-product" required value={form.product} onChange={(e) => updateField('product', e.target.value)} className={inputClass + errClass('product')} aria-invalid={!!fieldErrors.product}>
              <option value="">{t('quote.selectProduct')}</option>
              {Array.isArray(productOptions) && productOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {fieldError('product')}
          </div>

          <div>
            <label htmlFor="quote-quantity" className={labelClass}>{t('quote.quantity')}</label>
            <input id="quote-quantity" type="number" value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} className={inputClass} placeholder="e.g., 10,000" />
          </div>

          <div>
            <label htmlFor="quote-message" className={labelClass}>{t('quote.message')} *</label>
            <textarea id="quote-message" required value={form.message} onChange={(e) => updateField('message', e.target.value)} rows={3} className={inputClass + " resize-none" + errClass('message')} placeholder={t('contact.messagePlaceholder')} maxLength={1000} aria-invalid={!!fieldErrors.message} />
            {fieldError('message')}
          </div>

          {/* Honeypot - hidden from humans, bots will fill this */}
          <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="quote-website">Leave this empty</label>
            <input
              id="quote-website"
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FiSend className="w-4 h-4" />
                {t('quote.send')}
              </>
            )}
          </Button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">{t('quote.sent')}</h4>
          <p className="text-sm text-slate-500">{t('quote.sentDesc')}</p>
        </motion.div>
      )}
    </Modal>
  );
}
