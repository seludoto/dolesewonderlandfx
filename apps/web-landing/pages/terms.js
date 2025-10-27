import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Terms of Service - dolesewonderlandfx</title>
        <meta name="description" content="Terms of Service for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> October 26, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using dolesewonderlandfx (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-700 mb-4">
                  Permission is granted to temporarily access the materials (information or software) on dolesewonderlandfx&apos;s platform for personal, non-commercial transitory viewing only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Trading Risks</h2>
                <p className="text-gray-700 mb-4">
                  Forex trading involves substantial risk of loss and is not suitable for every investor. You should carefully consider whether trading is suitable for you in light of your circumstances and financial resources.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>You may sustain a total loss of initial margin funds and any additional funds deposited to maintain your position</li>
                  <li>If the market moves against you, you may be required to deposit additional funds to maintain your position</li>
                  <li>Trading foreign exchange on margin carries a high level of risk, and may not be suitable for all investors</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Uses</h2>
                <p className="text-gray-700 mb-4">You may not use our service:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Content</h2>
                <p className="text-gray-700 mb-4">
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for content that you post to the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  In no event shall dolesewonderlandfx, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which dolesewonderlandfx operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-700">
                  Email: legal@dolesewonderlandfx.me<br />
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