import { motion } from 'framer-motion'
import { Check, Star, Zap } from 'lucide-react'

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for beginners starting their forex journey",
    features: [
      "Daily AI Market Insights",
      "Basic Course Access",
      "Paper Trading Simulator",
      "Trade Journal",
      "Email Support",
      "Mobile App Access"
    ],
    popular: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline"
  },
  {
    name: "Pro Trader",
    price: "$79",
    period: "/month",
    description: "Advanced tools for serious traders",
    features: [
      "Everything in Starter",
      "Advanced Technical Analysis",
      "Backtesting Lab",
      "Real-time Alerts",
      "Priority Support",
      "API Access",
      "Custom Indicators",
      "Strategy Builder"
    ],
    popular: true,
    buttonText: "Start Pro Trial",
    buttonVariant: "primary"
  },
  {
    name: "Master Trader",
    price: "$149",
    period: "/month",
    description: "Complete trading ecosystem for professionals",
    features: [
      "Everything in Pro Trader",
      "AI Strategy Recommendations",
      "Portfolio Optimization",
      "Advanced Risk Management",
      "1-on-1 Coaching Sessions",
      "VIP Community Access",
      "Custom Strategy Development",
      "Performance Analytics"
    ],
    popular: false,
    buttonText: "Become a Master",
    buttonVariant: "secondary"
  }
]

export default function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Trading Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free trial and upgrade as you grow. All plans include our core AI-powered features.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                plan.popular
                  ? 'border-primary-500 shadow-primary-100 scale-105'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : plan.buttonVariant === 'secondary'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-secondary-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">30-Day Money Back Guarantee</h3>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked.
              We&apos;re confident you&apos;ll love our platform and see real trading improvements.
            </p>
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Have questions about our plans?</p>
          <button className="text-primary-600 hover:text-primary-700 font-semibold underline">
            View Frequently Asked Questions →
          </button>
        </motion.div>
      </div>
    </section>
  )
}