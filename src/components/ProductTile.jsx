import Picture from './Picture';
import { FiCheckCircle } from 'react-icons/fi';

const ACCENTS = {
  blue: {
    subtitle: 'text-blue-500',
    chip: 'border-blue-100 bg-blue-50/70 text-blue-700 group-hover:border-blue-200 group-hover:bg-blue-50',
  },
  cyan: {
    subtitle: 'text-cyan-700',
    chip: 'border-cyan-100 bg-cyan-50/70 text-cyan-700 group-hover:border-cyan-200 group-hover:bg-cyan-50',
  },
};

export default function ProductTile({ index, image, alt, badge, badgeIcon: BadgeIcon, title, subtitle, description, features = [], stats, visible = true, delay = '0ms', flip = false, accent = 'blue' }) {
  const a = ACCENTS[accent] || ACCENTS.blue;
  return (
    <article
      className={`relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-700 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: visible ? delay : '0ms' }}
    >
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-white">
        <div
          className={
            flip
              ? 'absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(59,130,246,0.22),transparent_62%)]'
              : 'absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,rgba(59,130,246,0.22),transparent_62%)]'
          }
        />
        <span className="absolute top-3 right-6 text-[5.5rem] lg:text-[7rem] font-black text-slate-200/90 leading-none select-none z-10 pointer-events-none">
          {index}
        </span>
        <Picture
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
          loading="lazy"
          decoding="async"
          src={image}
          alt={alt}
          className="relative z-10 w-full h-full object-contain p-5 lg:p-7 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {badge && (
          <div className="absolute left-5 top-5 z-20">
            <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />} {badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8">
        <h3 className="text-2xl lg:text-[1.75rem] font-bold text-[#0f172a] mb-1.5 leading-tight">{title}</h3>
        <p className={`font-semibold text-sm mb-3 ${a.subtitle}`}>{subtitle}</p>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">{description}</p>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${a.chip}`}
              >
                <FiCheckCircle className="w-3.5 h-3.5 shrink-0" />
                {f}
              </span>
            ))}
          </div>
        )}

        {stats && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`min-w-0 px-3 first:pl-0 last:pr-0 ${i > 0 ? 'border-l border-slate-100' : ''}`}
              >
                <p className="text-base sm:text-lg font-black text-[#0f172a] leading-none tracking-tight">{s.value}</p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
