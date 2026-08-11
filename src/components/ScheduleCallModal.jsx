import Modal from './Modal';
import { FiPhone, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function ScheduleCallModal({ isOpen, onClose }) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('schedule.title')} size="max-w-md">
      <div className="space-y-6">
        <p className="text-sm text-slate-500">
          {t('schedule.subtitle')}
        </p>

        {/* Phone Call */}
        <div className="group glass-card p-5 hover:border-slate-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <FiPhone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900 mb-1">{t('schedule.phoneCall')}</h4>
              <p className="text-xs text-slate-500 mb-3">{t('schedule.phoneDesc')}</p>
              <a
                href="tel:+917719463719"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
              >
                +91 77194 63719
                <FiArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="group glass-card p-5 hover:border-emerald-300 cursor-pointer transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FiMessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900 mb-1">{t('schedule.whatsapp')}</h4>
              <p className="text-xs text-slate-500 mb-3">{t('schedule.whatsappDesc')}</p>
              <a
                href="https://wa.me/917719463719"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                {t('schedule.startChat')}
                <FiArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
          {t('schedule.availability')}
        </p>
      </div>
    </Modal>
  );
}
