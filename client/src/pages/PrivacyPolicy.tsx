import { useEffect } from 'react';

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Cult of Psyche';
  }, []);

  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8 text-hot-pink">Privacy Policy</h1>
        
        <p className="text-gray-300 mb-6">
          <strong>Last Updated:</strong> April 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            Cult of Psyche ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website cultofpsyche.live (the "Site") and use our services.
          </p>
          <p className="text-gray-300">
            Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-hot-pink mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Account information (name, email, password)</li>
            <li>Payment information (processed securely via Stripe)</li>
            <li>Profile information (bio, preferences, interests)</li>
            <li>Content you create (forum posts, readings, comments)</li>
            <li>Communication preferences and feedback</li>
          </ul>

          <h3 className="text-xl font-semibold text-hot-pink mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li>Device information (browser type, IP address, device type)</li>
            <li>Usage data (pages visited, time spent, interactions)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Analytics data (Google Analytics, Google Tag Manager)</li>
            <li>Email engagement metrics (opens, clicks via Resend)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Process transactions and send related information</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve and optimize our Site and services</li>
            <li>Analyze usage patterns and trends</li>
            <li>Detect and prevent fraud or security issues</li>
            <li>Comply with legal obligations</li>
            <li>Personalize your experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-gray-300 mb-4">
            We use cookies and similar tracking technologies to enhance your experience. These include:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for site functionality and security</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our Site</li>
            <li><strong>Marketing Cookies:</strong> Track engagement and personalize content</li>
          </ul>
          <p className="text-gray-300">
            You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect Site functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">5. Data Sharing and Disclosure</h2>
          <p className="text-gray-300 mb-4">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Service providers (Stripe, Resend, Google Analytics)</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners with your consent</li>
            <li>Other users (for public profile information and forum posts)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">6. Data Security</h2>
          <p className="text-gray-300 mb-4">
            We implement industry-standard security measures including:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>HTTPS/TLS encryption for all data in transit</li>
            <li>Secure password hashing and storage</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure payment processing via Stripe</li>
          </ul>
          <p className="text-gray-300 mt-4">
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">7. Your Rights and Choices</h2>
          <p className="text-gray-300 mb-4">
            Depending on your location, you may have rights including:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability (receive your data in a portable format)</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="text-gray-300 mt-4">
            To exercise these rights, contact us at privacy@cultofpsyche.live.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">8. GDPR Compliance (EU Users)</h2>
          <p className="text-gray-300 mb-4">
            If you are located in the European Union, GDPR provides you with additional rights:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Rights related to automated decision-making</li>
          </ul>
          <p className="text-gray-300 mt-4">
            We process your data based on your consent or our legitimate interests. You can withdraw consent at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">9. Children's Privacy</h2>
          <p className="text-gray-300">
            Our Site is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will delete such information and terminate the child's account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">10. Third-Party Links</h2>
          <p className="text-gray-300">
            Our Site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-300">
            We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on our Site and updating the "Last Updated" date. Your continued use of the Site after changes constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan mb-4">12. Contact Us</h2>
          <p className="text-gray-300 mb-4">
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="bg-midnight/50 border border-cyan/30 rounded p-4 text-gray-300">
            <p><strong>Email:</strong> privacy@cultofpsyche.live</p>
            <p><strong>Website:</strong> cultofpsyche.live</p>
            <p><strong>Discord:</strong> https://discord.gg/qU7SdW3PYX</p>
          </div>
        </section>

        <div className="border-t border-cyan/30 pt-8 mt-8">
          <p className="text-gray-400 text-sm">
            This Privacy Policy is effective as of April 2026 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately upon posting to the Site.
          </p>
        </div>
      </div>
    </div>
  );
}
