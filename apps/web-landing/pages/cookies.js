import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Cookie Policy - dolesewonderlandfx</title>
        <meta name="description" content="Cookie Policy for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> October 26, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your computer or mobile device when you visit our website. They allow us to remember your preferences, analyze how you use our site, and provide you with a better experience.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for our website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                  <li>Authentication cookies (keep you logged in)</li>
                  <li>Security cookies (prevent fraudulent activities)</li>
                  <li>Session cookies (remember your session)</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                  <li>Google Analytics (traffic analysis)</li>
                  <li>Usage statistics (page views, time spent)</li>
                  <li>Error tracking (technical issues)</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies enable the website to provide enhanced functionality and personalization.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                  <li>Language preferences</li>
                  <li>Theme settings (dark/light mode)</li>
                  <li>Trading preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are used to track visitors across websites to display ads that are relevant and engaging for individual users.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 ml-4">
                  <li>Retargeting cookies (show relevant ads)</li>
                  <li>Social media cookies (social sharing)</li>
                  <li>Affiliate tracking cookies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Some cookies are set by third-party services that appear on our pages. We have no control over these cookies, and they are subject to the respective third party&apos;s privacy policy.
                </p>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Third parties we work with:</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Google Analytics (website analytics)</li>
                  <li>Stripe/PayPal (payment processing)</li>
                  <li>Social media platforms (sharing functionality)</li>
                  <li>Customer support tools</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
                <p className="text-gray-700 mb-4">
                  Cookies can be classified by their duration:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Remain until deleted or expired</li>
                  <li><strong>Secure Cookies:</strong> Only transmitted over HTTPS</li>
                  <li><strong>HttpOnly Cookies:</strong> Inaccessible to JavaScript</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Cookies</h2>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies in various ways:
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most web browsers allow you to control cookies through their settings. You can usually find these settings in the &apos;Options&apos; or &apos;Preferences&apos; menu of your browser.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Cookie Consent</h3>
                <p className="text-gray-700 mb-4">
                  When you first visit our website, you will see a cookie banner asking for your consent to use non-essential cookies. You can withdraw your consent at any time.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Opt-out Links</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                  <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Your Online Choices</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  If you disable cookies, some features of our website may not function properly:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>You may not be able to log in to your account</li>
                  <li>Your preferences may not be saved</li>
                  <li>Some pages may not display correctly</li>
                  <li>Analytics data may not be collected</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies, please contact us at:
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