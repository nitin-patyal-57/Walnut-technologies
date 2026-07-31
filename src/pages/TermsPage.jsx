import { brand } from '../data/content';

export default function TermsPage() {
  return (
    <section className="section-padding relative bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold font-display text-dark-950 mb-8">Terms of Service</h1>
        <p className="text-sm text-dark-500 mb-8">Last updated: January 2026</p>

        <div className="prose prose-sm max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">1. Acceptance of Terms</h2>
            <p className="text-dark-500 leading-relaxed">
              By accessing and using {brand.domain} and the services provided by {brand.fullName}, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">2. Services</h2>
            <p className="text-dark-500 leading-relaxed">
              {brand.fullName} provides Original Design Manufacturing electronics services including medical device manufacturing, payment system manufacturing, and custom electronics design and production. All services are subject to separate service agreements and specifications.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">3. Intellectual Property</h2>
            <p className="text-dark-500 leading-relaxed">
              All content on this website, including text, graphics, logos, and software, is the property of {brand.fullName} and is protected by intellectual property laws. Client-specific designs and specifications remain the property of the respective clients.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">4. Quotations and Orders</h2>
            <p className="text-dark-500 leading-relaxed">
              Quotations provided through our website or direct communication are valid for 30 days unless otherwise specified. All orders are subject to acceptance and confirmation by {brand.fullName}. Pricing, specifications, and delivery timelines are subject to change.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">5. Limitation of Liability</h2>
            <p className="text-dark-500 leading-relaxed">
              {brand.fullName} shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or services. Our liability is limited to the extent permitted by applicable law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">6. Governing Law</h2>
            <p className="text-dark-500 leading-relaxed">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mohali, Punjab, India.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark-950 mb-3">7. Contact</h2>
            <p className="text-dark-500 leading-relaxed">
              For questions about these Terms of Service, please contact us at {brand.email} or call {brand.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
