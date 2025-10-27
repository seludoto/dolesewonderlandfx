import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Privacy Policy - dolesewonderlandfx</title>
        <meta name="description" content="Privacy Policy for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> October 26, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Trading preferences and settings</li>
                </ul>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Trading activity and performance data</li>
                  <li>Platform usage statistics</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Personalize your experience and provide relevant content</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>
                <p className="text-gray-700 mb-4">We may share your information:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>With service providers who assist us in operating our platform</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer, such as a merger or acquisition</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data backup and recovery procedures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict certain processing of your information</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts.
                </p>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Types of Cookies We Use:</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
                <p className="text-gray-700 mb-4">
                  Our platform may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external sites or services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-gray-700">
                  Email: privacy@dolesewonderlandfx.me<br />
                  Address: [Your Business Address]
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}