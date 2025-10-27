import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Users, TrendingUp, Award, Globe, Shield, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>About Us - dolesewonderlandfx</title>
        <meta name="description" content="Learn about dolesewonderlandfx - empowering traders with AI-driven insights and comprehensive forex education" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About dolesewonderlandfx
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering traders worldwide with cutting-edge AI technology and comprehensive education
              to master the forex markets and achieve financial success.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                To democratize forex trading by providing accessible, intelligent tools and education
                that empower traders of all levels to make informed decisions and achieve their financial goals.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Active Traders</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Globe className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Markets</h3>
                <p className="text-gray-600">
                  Access to major currency pairs, commodities, indices, and cryptocurrencies
                  with real-time data and analysis.
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Management</h3>
                <p className="text-gray-600">
                  Advanced risk management tools, stop-loss orders, and position sizing
                  calculators to protect your capital.
                </p>
              </div>
              <div className="text-center">
                <Award className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Education</h3>
                <p className="text-gray-600">
                  Comprehensive courses, webinars, and resources designed by industry
                  experts and powered by AI insights.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Founded in 2023, dolesewonderlandfx emerged from a simple observation: traditional forex trading
                platforms were complex, expensive, and lacked the intelligent guidance traders needed to succeed.
              </p>
              <p className="text-gray-700 mb-6">
                Our team of experienced traders, financial analysts, and AI engineers came together with a mission
                to bridge this gap. We combined decades of trading experience with cutting-edge artificial intelligence
                to create a platform that makes professional-grade trading tools accessible to everyone.
              </p>
              <p className="text-gray-700 mb-6">
                Today, we serve traders in over 50 countries, providing them with the education, tools, and insights
                they need to navigate the complex world of forex trading with confidence.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Leadership Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">John Doe</h3>
                <p className="text-primary-600 font-medium mb-2">CEO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  15+ years in forex trading and financial technology. Former hedge fund trader.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Jane Smith</h3>
                <p className="text-primary-600 font-medium mb-2">CTO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  AI and machine learning expert with a background in quantitative finance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">MB</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Brown</h3>
                <p className="text-primary-600 font-medium mb-2">Head of Education</p>
                <p className="text-gray-600 text-sm">
                  Certified financial educator with experience teaching thousands of traders worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-600">
                  We believe in complete transparency in our operations, pricing, and risk disclosures.
                  Our traders deserve to know exactly what they&apos;re getting.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously invest in cutting-edge technology to provide our users with the most
                  advanced trading tools and AI-driven insights available.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Education</h3>
                <p className="text-gray-600">
                  Knowledge is power in trading. We provide comprehensive education resources to help
                  traders at every level improve their skills and understanding.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive trading community where experienced traders can share insights
                  and newcomers can learn from the best in the industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}