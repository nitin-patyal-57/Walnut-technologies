import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

/**
 * FAQ block + FAQPage JSON-LD.
 *
 * The questions double as keyword targets: question phrases ("where is
 * Walnut Technologies", "what is OEM ODM manufacturing") are exactly what
 * people type into Google, and the schema lets those Q&As surface in the
 * "People also ask" boxes. Keep each answer 1-3 sentences with the target
 * phrase spelled out in full (no pronoun-only answers - Google matches the
 * literal words).
 */
export default function Faq({ items, title, subtitle, id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [open, setOpen] = useState(0);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section id={id} ref={ref} className="bg-slate-50 py-12 md:py-16">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">
            <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
            {subtitle || 'Quick Answers'}
            <span className="w-6 h-[1.5px] bg-blue-400 rounded-full" />
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black font-display text-slate-900 leading-tight">
            {title || <>Frequently Asked <span className="text-blue-600">Questions</span></>}
          </h2>
          <div className="w-14 h-0.5 bg-blue-600 mx-auto rounded-full mt-1.5" />
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <span className="text-sm md:text-base font-bold font-display text-slate-900 leading-snug">
                  {item.q}
                </span>
                <span className="shrink-0 w-6 h-6 mt-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  {open === i ? <FiMinus className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
