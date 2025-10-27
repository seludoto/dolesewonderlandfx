import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Disclosure - dolesewonderlandfx</title>
        <meta name="description" content="Risk Disclosure for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Risk Disclosure</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> October 26, 2025
              </p>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>Important:</strong> Trading foreign exchange carries a high level of risk and may not be suitable for all investors. Please read this risk disclosure carefully before using our services.
                    </p>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. High Risk of Loss</h2>
                <p className="text-gray-700 mb-4">
                  Foreign exchange trading involves substantial risk of loss and is not suitable for every investor. The amount of money you can lose is potentially unlimited and can exceed the amount of money you deposit in your trading account.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>You may sustain a total loss of initial margin funds and any additional funds deposited to maintain your position</li>
                  <li>If the market moves against your position, you may be required to deposit additional funds immediately or your position may be liquidated at a loss</li>
                  <li>Under certain market conditions, you may find it difficult or impossible to liquidate a position</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Leverage and Margin Trading</h2>
                <p className="text-gray-700 mb-4">
                  Trading on margin allows you to control large positions with a relatively small amount of capital. While this can magnify profits, it can also magnify losses.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Leverage can work against you as well as for you</li>
                  <li>The use of leverage can lead to large losses as well as gains</li>
                  <li>You should only use leverage if you fully understand the risks and are prepared to accept them</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Market Volatility</h2>
                <p className="text-gray-700 mb-4">
                  The foreign exchange market is highly volatile. Prices can change rapidly and unpredictably due to various factors including economic events, political developments, and market sentiment.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Exchange rates can fluctuate significantly in short periods</li>
                  <li>News events can cause sudden and dramatic price movements</li>
                  <li>Markets can be closed or restricted during periods of high volatility</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Technical Risks</h2>
                <p className="text-gray-700 mb-4">
                  There are risks associated with using electronic trading systems, including hardware and software failures, internet connectivity issues, and platform malfunctions.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>System failures may prevent you from entering or exiting positions</li>
                  <li>Internet connectivity issues may delay order execution</li>
                  <li>Platform errors may result in unintended trades or losses</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Past Performance</h2>
                <p className="text-gray-700 mb-4">
                  Past performance of trading strategies, systems, or hypothetical results does not guarantee future results. Any claims of past performance should not be interpreted as an indication of future performance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. AI and Algorithmic Trading</h2>
                <p className="text-gray-700 mb-4">
                  While our AI-powered trading insights are designed to assist your decision-making, they do not guarantee profitable trades or eliminate risk.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>AI predictions are based on historical data and may not account for future market conditions</li>
                  <li>Algorithmic trading systems can experience drawdowns and periods of underperformance</li>
                  <li>You should always exercise your own judgment and risk management</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Educational Content</h2>
                <p className="text-gray-700 mb-4">
                  Our educational materials and courses are for informational purposes only and should not be considered as financial advice or recommendations to buy or sell any financial instrument.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Paper Trading</h2>
                <p className="text-gray-700 mb-4">
                  Paper trading (simulated trading) does not involve real money and therefore does not reflect the psychological pressures of real trading with actual capital at risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. No Guarantees</h2>
                <p className="text-gray-700 mb-4">
                  There are no guarantees of profit or protection against loss when trading foreign exchange. All trading involves risk, and you should only trade with money you can afford to lose.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Regulatory Considerations</h2>
                <p className="text-gray-700 mb-4">
                  Foreign exchange trading may be subject to regulation in your jurisdiction. You should ensure that you understand and comply with all applicable laws and regulations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Acknowledgment</h2>
                <p className="text-gray-700 mb-4">
                  By using dolesewonderlandfx services, you acknowledge that you have read, understood, and agree to accept the risks involved in foreign exchange trading as described in this risk disclosure.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-yellow-800">
                    <strong>Remember:</strong> Trading foreign exchange is not suitable for everyone. Only trade with money you can afford to lose, and never trade more than you can afford to lose in a single position.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Risk Disclosure, please contact us at:
                </p>
                <p className="text-gray-700">
                  Email: risk@dolesewonderlandfx.me<br />
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