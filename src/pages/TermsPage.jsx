import { brand } from '../data/content';
import { useLanguage } from '../context/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  const sections = t('terms.sections');

  return (
    <section className="section-padding relative bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold font-display text-dark-950 mb-8">{t('terms.title')}</h1>
        <p className="text-sm text-dark-500 mb-8">{t('terms.lastUpdated')}</p>

        <div className="prose prose-sm max-w-none space-y-8">
          {Array.isArray(sections) && sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-dark-950 mb-3">{section.title}</h2>
              <p className="text-dark-500 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
