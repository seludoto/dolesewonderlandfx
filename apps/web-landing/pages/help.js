import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { Search, Book, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react'

export default function HelpCenter() {
  const categories = [
    {
      title: "Getting Started",
      description: "New to forex trading? Start here with our beginner guides.",
      icon: Book,
      articles: [
        "How to create your account",
        "Understanding the trading dashboard",
        "Setting up your first trade",
        "Paper trading basics"
      ]
    },
    {
      title: "Trading Fundamentals",
      description: "Learn the core concepts of forex trading.",
      icon: MessageCircle,
      articles: [
        "What is forex trading?",
        "Currency pairs explained",
        "Reading forex charts",
        "Understanding leverage"
      ]
    },
    {
      title: "AI Features",
      description: "Master our AI-powered trading tools.",
      icon: HelpCircle,
      articles: [
        "How AI insights work",
        "Using trading signals",
        "Backtesting strategies",
        "Risk management tools"
      ]
    }
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use bank-level encryption and security measures to protect your data and funds."
    },
    {
      question: "How do I withdraw funds?",
      answer: "Go to your account settings and select 'Withdraw Funds'. Choose your preferred withdrawal method."
    },
    {
      question: "What are the trading hours?",
      answer: "Forex markets operate 24/5, from Sunday 5:00 PM EST to Friday 5:00 PM EST."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Help Center - dolesewonderlandfx</title>
        <meta name="description" content="Get help and support for dolesewonderlandfx trading platform" />
      </Head>

      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to your questions and get the help you need
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <category.icon className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a href="#" className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
                        <ChevronRight className="h-4 w-4 mr-1" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-primary-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <p className="text-lg mb-6">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@dolesewonderlandfx.me"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Email Support
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}