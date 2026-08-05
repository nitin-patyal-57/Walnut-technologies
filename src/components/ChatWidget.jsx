import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const quickReplies = [
  { label: 'Our Solutions', value: 'products' },
  { label: 'Robotics', value: 'robotics' },
  { label: 'Medical', value: 'medical' },
  { label: 'Fintech', value: 'fintech' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Manufacturing Process', value: 'process' },
  { label: 'Certifications', value: 'capabilities' },
  { label: 'Get a Quote', value: 'quote' },
  { label: 'Contact Info', value: 'contact' },
];

const intents = {
  greeting: {
    response: "Hello! Welcome to Walnut Technologies. How can I help you today?",
  },
  products: {
    response: "We manufacture across four divisions:\n\n- **Robotics** — AI-assisted rehabilitation & gait training\n- **Medical** — ISO 13485, Class 10K Cleanroom\n- **Fintech** — NPCI, RBI, PCI DSS Certified\n- **Automotive** — Industrial grade electronics\n\nWhich division interests you?",
  },
  robotics: {
    response: "Our robotics division includes:\n- WalkLab Gait Training System\n\nAI-assisted therapy with real-time patient monitoring and tele-rehab capabilities.",
  },
  medical: {
    response: "Our medical devices include:\n- Digital Blood Pressure Monitor\n- IR Thermometer\n- Oxygen Concentrator\n- Walnut Compressor Nebulizer\n\nISO 13485 certified with Class 10K cleanroom.",
  },
  fintech: {
    response: "Our fintech payment systems include:\n- Single SIM Model\n- Double SIM Model\n- With Display Model\n- Common Model\n- DQR: Double Display\n- All in One\n\nEMV L1/L2 certified, NPCI & RBI compliant.",
  },
  automotive: {
    response: "Our automotive division provides:\n- Cluster Displays\n- Harvester Electronics\n\nIndustrial grade, durable designs for demanding environments.",
  },
  process: {
    response: "Our 6-step manufacturing process:\n1. Consultation\n2. Design & Engineering\n3. PCB Fabrication\n4. Production\n5. Certification & Testing\n6. Delivery & Support\n\nWant to discuss your project?",
  },
  capabilities: {
    response: "Our key capabilities:\n- 150,000 sq.ft facility\n- Class 10K Cleanroom\n- ISO 13485 & ISO 9001 Certified\n- CE, FCC, PCI-DSS compliance\n- 500+ Engineers\n- 300K+ Units/Month",
  },
  quote: {
    response: "We'd love to provide a custom quote! Pricing depends on product type, volume, certifications, and timeline.\n\nClick **Request a Quote** or call us at +91 77194 63719.",
  },
  contact: {
    response: "Contact us:\n- Phone: +91 77194 63719\n- Email: contact@walnutmedical.in\n- Address: Plot No. 132, JLPL Industrial Park, Sector 82, Mohali, Punjab\n\nMon-Sat, 9 AM - 6 PM IST",
  },
  default: {
    response: "You can ask me about:\n- Our products & divisions\n- Manufacturing capabilities\n- Pricing & quotes\n- Process & timeline\n- Contact information",
  },
};

function findIntent(message) {
  const lower = message.toLowerCase();
  for (const [key, intent] of Object.entries(intents)) {
    if (key === 'default' || key === 'greeting') continue;
    if (lower.includes(key)) return key;
  }
  if (lower.match(/(hi|hello|hey|greet)/)) return 'greeting';
  if (lower.match(/(quote|price|cost|pricing)/)) return 'quote';
  if (lower.match(/(contact|call|email|phone|address)/)) return 'contact';
  if (lower.match(/(capability|cert|iso|facility)/)) return 'capabilities';
  if (lower.match(/(process|step|how|workflow)/)) return 'process';
  return 'default';
}

export default function ChatWidget({ onOpenQuote }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: intents.greeting.response },
  ]);
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

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
        setMessages((prev) => [...prev, { role: 'bot', content: "Opening the quote form for you..." }]);
      } else {
        const response = intents[intent]?.response || intents.default.response;
        setMessages((prev) => [...prev, { role: 'bot', content: response }]);
      }
      setTimeout(() => setShowQuickReplies(true), 300);
    }, 400);
  };

  const handleSend = () => sendMessage(input);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 text-white scale-90'
            : 'bg-slate-900 text-white hover:scale-110'
        }`}
      >
        {isOpen ? <FiX className="w-5 h-5" /> : <FiMessageSquare className="w-5 h-5" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-6 z-40 w-[340px] max-w-[calc(100vw-2rem)] h-[460px] bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                  <FiMessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Walnut Assistant</h4>
                  <p className="text-[10px] text-emerald-500">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
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

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="px-3 pb-2 flex flex-wrap gap-1">
                {quickReplies.map((qr) => (
                  <button
                    key={qr.value}
                    onClick={() => sendMessage(qr.label)}
                    className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200">
              <div className="flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
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
