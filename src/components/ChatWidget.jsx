import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

function findIntent(message) {
  const lower = message.toLowerCase();
  const intentKeywords = {
    products: ['products', 'solutions', 'robotics', 'medical', 'fintech', 'automotive'],
    robotics: ['robotics', 'walklab', 'gait'],
    medical: ['medical', 'blood pressure', 'thermometer', 'nebulizer', 'oxygen'],
    fintech: ['fintech', 'payment', 'sim', 'soundbox'],
    automotive: ['automotive', 'cluster', 'harvester'],
    process: ['process', 'step', 'how', 'workflow', 'manufacturing'],
    capabilities: ['capability', 'cert', 'iso', 'facility', 'cleanroom'],
    quote: ['quote', 'price', 'cost', 'pricing'],
    contact: ['contact', 'call', 'email', 'phone', 'address'],
  };
  for (const [key, keywords] of Object.entries(intentKeywords)) {
    if (lower.includes(key) || keywords.some(kw => lower.includes(kw))) return key;
  }
  if (lower.match(/(hi|hello|hey|greet)/)) return 'greeting';
  return 'default';
}

export default function ChatWidget({ onOpenQuote, onChatStateChange }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: t('chat.responses.greeting') },
  ]);
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickReplies = [
    { key: 'products', value: 'products' },
    { key: 'robotics', value: 'robotics' },
    { key: 'medical', value: 'medical' },
    { key: 'fintech', value: 'fintech' },
    { key: 'automotive', value: 'automotive' },
    { key: 'process', value: 'process' },
    { key: 'capabilities', value: 'capabilities' },
    { key: 'quote', value: 'quote' },
    { key: 'contact', value: 'contact' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    onChatStateChange?.(isOpen);
  }, [isOpen, onChatStateChange]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-walnut-chat', handleOpenChat);
    return () => window.removeEventListener('open-walnut-chat', handleOpenChat);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setShowQuickReplies(false);

    setTimeout(() => {
      const intent = findIntent(userMsg);
      if (intent === 'quote' && onOpenQuote) {
        onOpenQuote();
        setMessages((prev) => [...prev, { role: 'bot', content: t('chat.responses.openingQuote') }]);
      } else {
        const response = t(`chat.responses.${intent}`) || t('chat.responses.default');
        setMessages((prev) => [...prev, { role: 'bot', content: response }]);
      }
      setTimeout(() => setShowQuickReplies(true), 300);
    }, 400);
  };

  const handleSend = () => sendMessage(input);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className={`fixed bottom-24 lg:bottom-6 right-6 z-50 w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 text-white scale-90'
            : 'bg-slate-900 text-white hover:scale-110'
        }`}
      >
        {isOpen ? <FiX className="w-5 h-5" /> : <FiMessageSquare className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-32 lg:bottom-20 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] h-[460px] bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                  <FiMessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{t('chat.name')}</h4>
                  <p className="text-xs text-emerald-500">{t('chat.online')}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm border border-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showQuickReplies && (
              <div className="px-3 pb-2 flex flex-wrap gap-1">
                {quickReplies.map((qr) => (
                  <button
                    key={qr.value}
                    onClick={() => sendMessage(t(`chat.quickReplies.${qr.key}`))}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                  >
                    {t(`chat.quickReplies.${qr.key}`)}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-slate-200">
              <div className="flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
