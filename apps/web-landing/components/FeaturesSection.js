import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  BookOpen,
  Target,
  BarChart3,
  Users,
  Shield,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced machine learning algorithms analyze market patterns and provide daily trading insights with 85% accuracy rate.",
    color: "from-blue-500 to-cyan-500",
    stats: "85% Accuracy"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Live market data, technical indicators, and automated signals help you make informed trading decisions instantly.",
    color: "from-green-500 to-emerald-500",
    stats: "24/7 Live Data"
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Comprehensive courses from basics to advanced strategies, designed by professional traders with decades of experience.",
    color: "from-purple-500 to-indigo-500",
    stats: "50+ Courses"
  },
  {
    icon: Target,
    title: "Risk Management",
    description: "Advanced risk assessment tools, position sizing calculators, and automated stop-loss recommendations.",
    color: "from-red-500 to-pink-500",
    stats: "99% Risk Control"
  },
  {
    icon: BarChart3,
    title: "Backtesting Lab",
    description: "Test strategies on historical data spanning 20+ years. Optimize parameters and validate performance before going live.",
    color: "from-orange-500 to-yellow-500",
    stats: "20+ Years Data"
  },
  {
    icon: Users,
    title: "Community Trading",
    description: "Connect with successful traders, share strategies, and learn from the community in our exclusive VIP groups.",
    color: "from-teal-500 to-green-500",
    stats: "10K+ Members"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Bank-level security with SSL encryption, two-factor authentication, and secure API connections.",
    color: "from-gray-600 to-gray-800",
    stats: "Bank-Level Security"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with sub-second execution times and real-time synchronization across all devices.",
    color: "from-yellow-500 to-orange-500",
    stats: "<1s Execution"
  },
  {
    icon: Globe,
    title: "Global Markets",
    description: "Access to 50+ currency pairs, commodities, indices, and cryptocurrencies from major global exchanges.",
    color: "from-blue-600 to-indigo-600",
    stats: "50+ Instruments"
  },
  {
    icon: Smartphone,
    title: "Mobile Trading",
    description: "Full-featured mobile app with all desktop capabilities. Trade anywhere, anytime from your smartphone.",
    color: "from-pink-500 to-rose-500",
    stats: "iOS & Android"
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Trading Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the most comprehensive forex trading platform with cutting-edge technology
            and professional-grade tools designed for serious traders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full inline-block">
                {feature.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                See It In Action
              </h3>
              <p className="text-lg text-primary-100 mb-6">
                Experience our platform with a live interactive demo. No signup required -
                explore all features and see how AI can transform your trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Launch Interactive Demo
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Watch Video Tour
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Live Demo Dashboard</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active</span>
                  </div>
                </div>

                {/* Mock Trading Interface */}
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">EUR/USD</span>
                      <span className="text-green-300 text-sm font-bold">+1.24%</span>
                    </div>
                    <div className="text-lg font-bold">1.0847</div>
                  </div>

                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">GBP/USD</span>
                      <span className="text-red-300 text-sm font-bold">-0.87%</span>
                    </div>
                    <div className="text-lg font-bold">1.2734</div>
                  </div>

                  <div className="bg-green-500/30 rounded-lg p-3 border border-green-400/50">
                    <div className="text-sm font-medium text-green-300 mb-1">AI Signal</div>
                    <div className="text-sm">Strong BUY opportunity detected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}