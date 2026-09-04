import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const sections = t('privacy.sections');

  return (
    <section className="section-padding relative bg-white">
      <SEO
        title="Privacy Policy"
        description="Walnut Technologies Privacy Policy - Learn how we collect, use, and protect your personal information. Your privacy is important to us."
        path="/privacy"
        noindex={true}
      />
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold font-display text-dark-950 mb-8">{t('privacy.title')}</h1>
        <p className="text-sm text-dark-500 mb-8">{t('privacy.lastUpdated')}</p>

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
