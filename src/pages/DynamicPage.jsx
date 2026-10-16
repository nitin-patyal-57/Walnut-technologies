import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  FiHeart, FiShield, FiZap, FiCpu, FiGlobe, FiCheck, FiStar, FiBriefcase,
  FiTool, FiActivity, FiAward, FiClock, FiLayers, FiChevronDown,
} from 'react-icons/fi';
import { pages } from '../data/content';
import SEO from '../components/SEO';
import Picture from '../components/Picture';
import NotFound from './NotFound';

// Cards may name an icon; unknown names simply render no icon rather than
// breaking the page.
const ICONS = {
  heart: FiHeart, shield: FiShield, zap: FiZap, cpu: FiCpu, globe: FiGlobe,
  check: FiCheck, star: FiStar, briefcase: FiBriefcase, tool: FiTool,
  activity: FiActivity, award: FiAward, clock: FiClock, layers: FiLayers,
};

const TONES = {
  light: 'bg-white text-slate-900',
  muted: 'bg-slate-50 text-slate-900',
  dark: 'bg-slate-900 text-white',
  brand: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white',
};

const HEADING_TONE = {
  light: 'text-slate-900',
  muted: 'text-slate-900',
  dark: 'text-white',
  brand: 'text-white',
};

const BODY_TONE = {
  light: 'text-slate-600',
  muted: 'text-slate-600',
  dark: 'text-slate-300',
  brand: 'text-slate-300',
};

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

// Blank line = new paragraph; single newlines stay in the same paragraph.
function Paragraphs({ text, className }) {
  if (!text) return null;
  const blocks = String(text).split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  return blocks.map((b, i) => (
    <p key={i} className={className}>
      {b.split('\n').map((line, j) => (
        <span key={j}>
          {line}
          {j < b.split('\n').length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

function Block({ block, index }) {
  if (!block) return null;
  const tone = TONES[block.tone] || TONES.light;
  const headingClass = `font-display font-bold text-xl md:text-2xl ${HEADING_TONE[block.tone] || HEADING_TONE.light}`;
  const bodyClass = `text-sm md:text-base leading-relaxed ${BODY_TONE[block.tone] || BODY_TONE.light}`;
  const pad = 'section-padding';

  switch (block.type) {
    case 'heading':
      return (
        <section className={`${pad} ${tone}`}>
          <Reveal>
            <div className="container-custom">
              <div className="max-w-4xl">
                {block.heading && <h2 className={headingClass}>{block.heading}</h2>}
                <Paragraphs text={block.text} className={`${bodyClass} mt-4`} />
              </div>
            </div>
          </Reveal>
        </section>
      );

    case 'text':
      return (
        <section className={`${pad} ${tone}`}>
          <Reveal>
            <div className="container-custom">
              <div className="max-w-3xl">
                {block.heading && <h2 className={`${headingClass} mb-5`}>{block.heading}</h2>}
                <div className="space-y-4">
                  <Paragraphs text={block.text} className={bodyClass} />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      );

    case 'image':
      return (
        <section className={`${pad} ${tone}`}>
          <Reveal>
            <div className="container-custom">
              <div className="max-w-5xl">
                {block.heading && <h2 className={`${headingClass} mb-6`}>{block.heading}</h2>}
                {block.image && (
                  <Picture
                    src={block.image}
                    alt={block.heading || ''}
                    className="w-full rounded-2xl border border-slate-200 shadow-sm"
                  />
                )}
                <Paragraphs text={block.text} className={`${bodyClass} mt-5`} />
              </div>
            </div>
          </Reveal>
        </section>
      );

    case 'cards': {
      const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[block.columns || '3'];
      return (
        <section className={`${pad} ${tone}`}>
          <div className="container-custom">
            <Reveal>
              <div className="max-w-3xl">
                {block.heading && <h2 className={headingClass}>{block.heading}</h2>}
                <Paragraphs text={block.text} className={`${bodyClass} mt-4`} />
              </div>
            </Reveal>
            <div className={`mt-10 grid grid-cols-1 gap-5 ${cols}`}>
              {(block.cards || []).map((c, i) => {
                const Icon = ICONS[(c.icon || '').toLowerCase()];
                return (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      {Icon && (
                        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                      )}
                      <h3 className="font-display font-semibold text-slate-900">{c.title}</h3>
                      {c.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.description}</p>}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'stats':
      return (
        <section className={`${pad} ${tone}`}>
          <div className="container-custom">
            {block.heading && (
              <Reveal>
                <h2 className={`${headingClass} text-center`}>{block.heading}</h2>
              </Reveal>
            )}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(block.stats || []).map((s, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <div className="font-display text-2xl font-bold text-slate-900">{s.value}</div>
                    <div className="mt-1 text-xs text-slate-500">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case 'faq':
      return (
        <section className={`${pad} ${tone}`}>
          <div className="container-custom">
            <div className="max-w-3xl">
              {block.heading && (
                <Reveal>
                  <h2 className={`${headingClass} mb-6`}>{block.heading}</h2>
                </Reveal>
              )}
              <div className="space-y-3">
                {(block.items || []).map((q, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <details className="group rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                        {q.question}
                        <FiChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{q.answer}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className={`${pad} ${tone}`}>
          <Reveal>
            <div className="container-custom max-w-3xl text-center">
              {block.heading && <h2 className={headingClass}>{block.heading}</h2>}
              <Paragraphs text={block.text} className={`${bodyClass} mt-4`} />
              {block.ctaLabel && block.ctaLink && (
                <CtaLink to={block.ctaLink} label={block.ctaLabel} />
              )}
            </div>
          </Reveal>
        </section>
      );

    default:
      return null;
  }
}

// Buttons can point at another site page or an external URL.
function CtaLink({ to, label }) {
  const cls = 'mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700';
  if (/^https?:\/\//.test(to)) {
    return <a href={to} className={cls} target="_blank" rel="noopener noreferrer">{label}</a>;
  }
  return <Link to={to} className={cls}>{label}</Link>;
}

export default function DynamicPage() {
  const { slug } = useParams();
  const page = pages.find((p) => p.slug === slug);

  // Unknown slug → the site's real 404, so mistyped links don't render blank.
  if (!page) return <NotFound />;

  return (
    <>
      <SEO
        title={page.seoTitle || page.title}
        description={page.seoDescription || page.subtitle || page.title}
        path={`/p/${page.slug}`}
        image={page.heroImage}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-custom max-w-4xl text-center">
          <Reveal>
            <h1 className="font-display text-3xl font-bold text-white md:text-5xl">{page.title}</h1>
            {page.subtitle && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                {page.subtitle}
              </p>
            )}
            {page.ctaLabel && page.ctaLink && <CtaLink to={page.ctaLink} label={page.ctaLabel} />}
          </Reveal>
        </div>
        {page.heroImage && (
          <div className="container-custom mt-12 max-w-5xl">
            <Reveal delay={0.1}>
              <Picture
                src={page.heroImage}
                alt={page.title}
                className="w-full rounded-2xl border border-white/10 shadow-2xl"
              />
            </Reveal>
          </div>
        )}
      </section>

      {(page.blocks || []).map((block, i) => (
        <Block key={i} block={block} index={i} />
      ))}
    </>
  );
}
