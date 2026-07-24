import { brand } from '../data/content';

export default function PrivacyPage() {
  return (
    <section className="section-padding relative bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold font-display text-dark-950 mb-8">Privacy Policy</h1>
        <p className="text-sm text-dark-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-sm max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">1. Information We Collect</h2>
            <p className="text-dark-500 leading-relaxed">
              When you visit {brand.domain}, submit a contact form, request a quote, or interact with our chat widget, we may collect personal information including your name, email address, phone number, company name, and project details. We also collect non-personal information such as browser type, IP address, and pages visited through cookies and analytics tools.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">2. How We Use Your Information</h2>
            <p className="text-dark-500 leading-relaxed">
              We use your information to respond to inquiries, provide quotes, deliver our services, send relevant updates about our products and services, improve our website experience, and comply with legal obligations. We do not sell or rent your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">3. Data Security</h2>
            <p className="text-dark-500 leading-relaxed">
              We implement industry-standard security measures including SSL encryption, secure server infrastructure, and access controls to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">4. Cookies</h2>
            <p className="text-dark-500 leading-relaxed">
              Our website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">5. Third-Party Services</h2>
            <p className="text-dark-500 leading-relaxed">
              We may use third-party services such as Google Analytics, payment processors, and email service providers. These services have their own privacy policies governing the use of your information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">6. Your Rights</h2>
            <p className="text-dark-500 leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at {brand.email}.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">7. Contact Us</h2>
            <p className="text-dark-500 leading-relaxed">
              For privacy-related inquiries, please contact us at {brand.email} or write to us at {brand.location}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
